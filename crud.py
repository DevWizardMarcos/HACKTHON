from sqlalchemy.orm import Session
from models import Usuario
from auth import gerar_hash

def criar_usuario(db: Session, usuario):

    senha = gerar_hash(usuario.senha)

    novo = Usuario(
        nome=usuario.nome,
        email=usuario.email,
        senha=senha
    )

    db.add(novo)
    db.commit()
    db.refresh(novo)

    return novo


def buscar_email(db: Session, email):

    return db.query(Usuario).filter(
        Usuario.email == email
    ).first()