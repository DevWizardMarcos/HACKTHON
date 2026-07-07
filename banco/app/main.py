from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from .database import Base, engine, SessionLocal
from .models import Usuario
from . import schemas, crud
from .auth import verificar_senha

app = FastAPI(title="API de Cadastro e Login")

# Cria as tabelas no banco de dados
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/cadastro", response_model=schemas.UsuarioResponse)
def cadastro(usuario: schemas.UsuarioCreate,
              db: Session = Depends(get_db)):

    existe = crud.buscar_email(db, usuario.email)

    if existe:
        raise HTTPException(
            status_code=400,
            detail="E-mail já cadastrado."
        )

    return crud.criar_usuario(db, usuario)


@app.post("/login")
def login(usuario: schemas.UsuarioLogin,
          db: Session = Depends(get_db)):

    user = crud.buscar_email(db, usuario.email)

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Usuário não encontrado."
        )

    if not verificar_senha(usuario.senha, user.senha):
        raise HTTPException(
            status_code=401,
            detail="Senha incorreta."
        )

    return {
        "mensagem": "Login realizado com sucesso!",
        "usuario": {
            "id": user.id,
            "nome": user.nome,
            "email": user.email
        }
    }