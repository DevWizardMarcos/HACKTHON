import re
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class EmailInput(BaseModel):
    email: EmailStr

    @field_validator("email")
    @classmethod
    def normalizar_email(cls, value):
        return value.lower()


class SenhaInput(BaseModel):
    senha: str = Field(min_length=8, max_length=72)

    @field_validator("senha")
    @classmethod
    def limitar_bytes(cls, value):
        if len(value.encode()) > 72:
            raise ValueError("A senha deve ter no máximo 72 bytes.")
        return value


class UsuarioCreate(EmailInput, SenhaInput):
    nome: str = Field(min_length=2, max_length=150)
    cpf: str

    @field_validator("nome")
    @classmethod
    def validar_nome(cls, value):
        value = value.strip()
        if len(value) < 2:
            raise ValueError("Informe seu nome.")
        return value

    @field_validator("cpf")
    @classmethod
    def validar_cpf(cls, value):
        if re.search(r"[^0-9.\-\s]", value):
            raise ValueError("CPF inválido.")
        value = re.sub(r"\D", "", value)
        if len(value) != 11 or len(set(value)) == 1:
            raise ValueError("CPF inválido.")
        for tamanho in (9, 10):
            soma = sum(int(value[i]) * (tamanho + 1 - i) for i in range(tamanho))
            if (soma * 10 % 11) % 10 != int(value[tamanho]):
                raise ValueError("CPF inválido.")
        return value


class UsuarioLogin(BaseModel):
    identificador: str = Field(min_length=1, max_length=254)
    senha: str = Field(min_length=1, max_length=72)


class RedefinirSenha(SenhaInput):
    token: str = Field(min_length=20, max_length=128)


class UsuarioResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    nome: str
    email: str
