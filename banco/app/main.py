import os
import re
import smtplib
import ssl
import time
from contextlib import asynccontextmanager
from email.message import EmailMessage
from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .database import Base, engine, SessionLocal
from .models import Usuario, Documento, Token
from . import schemas, crud
from .auth import gerar_hash, verificar_senha, novo_token, hash_token

ROOT = Path(__file__).resolve().parents[2]
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"


@asynccontextmanager
async def lifespan(app):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Infinity — autenticação", lifespan=lifespan)


def get_db():
    with SessionLocal() as db:
        yield db


@app.middleware("http")
async def proteger_origem(request: Request, call_next):
    if request.method in {"POST", "PUT", "PATCH", "DELETE"}:
        origin = request.headers.get("origin")
        if origin and origin != str(request.base_url).rstrip("/"):
            return Response(status_code=403)
    response = await call_next(request)
    response.headers["Referrer-Policy"] = "no-referrer"
    if request.url.path in {"/login", "/me", "/recuperar-senha", "/redefinir-senha"}:
        response.headers["Cache-Control"] = "no-store"
    return response


@app.post("/cadastro", response_model=schemas.UsuarioResponse, status_code=201)
def cadastro(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    novo = Usuario(nome=usuario.nome, email=usuario.email, senha=gerar_hash(usuario.senha))
    try:
        db.add(novo)
        db.flush()
        db.add(Documento(cpf=usuario.cpf, usuario_id=novo.id))
        db.commit()
        db.refresh(novo)
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "E-mail ou CPF já cadastrado.")
    return novo


@app.post("/login")
def login(usuario: schemas.UsuarioLogin, response: Response, db: Session = Depends(get_db)):
    identificador = usuario.identificador.strip().lower()
    if "@" in identificador:
        user = crud.buscar_email(db, identificador)
    else:
        documento = db.get(Documento, re.sub(r"\D", "", identificador))
        user = db.get(Usuario, documento.usuario_id) if documento else None
    if user is None or not verificar_senha(usuario.senha, user.senha):
        raise HTTPException(401, "CPF/e-mail ou senha inválidos.")
    token = novo_token()
    db.add(Token(digest=hash_token(token), usuario_id=user.id, finalidade="sessao",
                 expira=int(time.time()) + 28800))
    db.commit()
    response.set_cookie("sessao", token, httponly=True, secure=COOKIE_SECURE,
                        samesite="lax", max_age=28800)
    return {"mensagem": "Login realizado com sucesso!", "usuario": schemas.UsuarioResponse.model_validate(user)}


@app.get("/me", response_model=schemas.UsuarioResponse)
def me(request: Request, db: Session = Depends(get_db)):
    token = db.get(Token, hash_token(request.cookies.get("sessao", "")))
    if not token or token.finalidade != "sessao" or token.expira <= time.time():
        raise HTTPException(401, "Faça login para continuar.")
    user = db.get(Usuario, token.usuario_id)
    if not user:
        raise HTTPException(401, "Faça login para continuar.")
    return user


@app.post("/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    db.execute(delete(Token).where(Token.digest == hash_token(request.cookies.get("sessao", "")),
                                   Token.finalidade == "sessao"))
    db.commit()
    response.delete_cookie("sessao", secure=COOKIE_SECURE, httponly=True, samesite="lax")
    return {"mensagem": "Sessão encerrada."}


def enviar_recuperacao(email, token):
    mensagem = EmailMessage()
    mensagem["Subject"] = "Redefina sua senha — Infinity"
    mensagem["From"] = os.environ["SMTP_FROM"]
    mensagem["To"] = email
    base = os.environ["PUBLIC_BASE_URL"].rstrip("/")
    mensagem.set_content(f"Use este link em até 30 minutos:\n{base}/Redefinir/redefinir-senha.html?token={token}\nSe não solicitou, ignore este e-mail.")
    with smtplib.SMTP(os.environ["SMTP_HOST"], int(os.getenv("SMTP_PORT", "587")), timeout=15) as smtp:
        smtp.starttls(context=ssl.create_default_context())
        if os.getenv("SMTP_USER"):
            smtp.login(os.environ["SMTP_USER"], os.environ["SMTP_PASSWORD"])
        smtp.send_message(mensagem)


@app.post("/recuperar-senha")
def recuperar(dados: schemas.EmailInput, db: Session = Depends(get_db)):
    if not all(os.getenv(key) for key in ("SMTP_HOST", "SMTP_FROM", "PUBLIC_BASE_URL")):
        raise HTTPException(503, "Envio de e-mail ainda não configurado.")
    user = crud.buscar_email(db, dados.email)
    if user:
        token = novo_token()
        db.execute(delete(Token).where(Token.usuario_id == user.id, Token.finalidade == "recuperacao"))
        db.add(Token(digest=hash_token(token), usuario_id=user.id, finalidade="recuperacao",
                     expira=int(time.time()) + 1800))
        try:
            enviar_recuperacao(user.email, token)
        except (OSError, smtplib.SMTPException):
            db.rollback()
            raise HTTPException(503, "Não foi possível enviar o e-mail. Tente novamente.")
        db.commit()
    return {"mensagem": "Se o e-mail estiver cadastrado, você receberá um link de recuperação."}


@app.post("/redefinir-senha")
def redefinir(dados: schemas.RedefinirSenha, db: Session = Depends(get_db)):
    token = db.get(Token, hash_token(dados.token))
    if not token or token.finalidade != "recuperacao" or token.expira <= time.time():
        raise HTTPException(400, "Link inválido ou expirado. Solicite outro.")
    usuario_id = token.usuario_id
    resultado = db.execute(delete(Token).where(Token.digest == token.digest,
                                               Token.expira > int(time.time())))
    if resultado.rowcount != 1:
        db.rollback()
        raise HTTPException(400, "Link inválido ou expirado. Solicite outro.")
    user = db.get(Usuario, usuario_id)
    user.senha = gerar_hash(dados.senha)
    db.execute(delete(Token).where(Token.usuario_id == user.id))
    db.commit()
    return {"mensagem": "Senha alterada. Entre com sua nova senha."}


@app.get("/", include_in_schema=False)
def inicio():
    return RedirectResponse("/Login/login.html")


# Publica apenas as pastas do frontend, sem expor código, banco ou configuração.
for pasta in ("Login", "Cadastro", "Redefinir", "assets"):
    app.mount(f"/{pasta}", StaticFiles(directory=ROOT / pasta), name=pasta)
