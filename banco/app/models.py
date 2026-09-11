from sqlalchemy import Column, Integer, String, ForeignKey
from .database import Base

class Usuario(Base):

    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)

    nome = Column(String, nullable=False)

    email = Column(String, unique=True)

    senha = Column(String)


class Documento(Base):
    __tablename__ = "documentos"
    cpf = Column(String(11), primary_key=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), unique=True, nullable=False)


class Token(Base):
    __tablename__ = "tokens"
    digest = Column(String(64), primary_key=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    finalidade = Column(String, nullable=False)
    expira = Column(Integer, nullable=False)
