from passlib.context import CryptContext

pwd = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def gerar_hash(senha):

    return pwd.hash(senha)


def verificar_senha(senha, senha_hash):

    return pwd.verify(senha, senha_hash)