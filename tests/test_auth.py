import os
import tempfile
import time
import unittest
from unittest.mock import patch

_temp = tempfile.TemporaryDirectory()
os.environ["DATABASE_URL"] = "sqlite:///" + _temp.name.replace("\\", "/") + "/test.db"

from fastapi.testclient import TestClient
from banco.app.main import app
from banco.app.database import Base, engine, SessionLocal
from banco.app.models import Token, Usuario
from banco.app.auth import hash_token


class AuthTests(unittest.TestCase):
    def setUp(self):
        Base.metadata.drop_all(engine)
        self.client = TestClient(app)
        self.client.__enter__()
        self.dados = dict(nome="Pessoa Teste", cpf="529.982.247-25",
                          email="pessoa@example.com", senha="Senha123!")

    def tearDown(self):
        self.client.__exit__(None, None, None)

    def cadastrar(self):
        response = self.client.post("/cadastro", json=self.dados)
        self.assertEqual(response.status_code, 201, response.text)
        self.assertNotIn("senha", response.json())

    def login(self, senha="Senha123!"):
        return self.client.post("/login", json={"identificador": self.dados["cpf"], "senha": senha})

    def test_cadastro_login_logout(self):
        self.cadastrar()
        with SessionLocal() as db:
            self.assertNotEqual(db.query(Usuario).first().senha, self.dados["senha"])
        self.assertEqual(self.client.post("/cadastro", json=self.dados).status_code, 409)
        self.assertEqual(self.login("errada").status_code, 401)
        response = self.login()
        self.assertEqual(response.status_code, 200)
        self.assertIn("HttpOnly", response.headers["set-cookie"])
        self.assertEqual(self.client.get("/me").status_code, 200)
        self.assertEqual(self.client.post("/logout").status_code, 200)
        self.assertEqual(self.client.get("/me").status_code, 401)
        self.assertEqual(self.client.post("/login", json={
            "identificador": "PESSOA@example.com", "senha": self.dados["senha"]}).status_code, 200)

    def test_validacao(self):
        for campo, valor in (("cpf", "11111111111"), ("email", "invalido"),
                             ("senha", "curta"), ("nome", "  "), ("senha", "é" * 40)):
            with self.subTest(campo=campo):
                self.assertEqual(self.client.post("/cadastro", json={
                    **self.dados, campo: valor}).status_code, 422)
        self.assertEqual(self.client.post("/login", json={}).status_code, 422)

    def test_recuperacao(self):
        self.cadastrar()
        self.login()
        with patch.dict(os.environ, {"SMTP_HOST": "smtp.example.com",
                                    "SMTP_FROM": "no-reply@example.com",
                                    "PUBLIC_BASE_URL": "http://testserver"}):
            with patch("banco.app.main.enviar_recuperacao") as enviar:
                response = self.client.post("/recuperar-senha", json={"email": self.dados["email"]})
                self.assertEqual(response.status_code, 200)
                token = enviar.call_args.args[1]
                desconhecido = self.client.post("/recuperar-senha", json={"email": "outro@example.com"})
                self.assertEqual(response.json(), desconhecido.json())
                self.assertEqual(enviar.call_count, 1)
        with SessionLocal() as db:
            self.assertIsNotNone(db.get(Token, hash_token(token)))
            self.assertIsNone(db.get(Token, token))
        dados = {"token": token, "senha": "NovaSenha123!"}
        self.assertEqual(self.client.post("/redefinir-senha", json=dados).status_code, 200)
        self.assertEqual(self.client.get("/me").status_code, 401)
        self.assertEqual(self.client.post("/redefinir-senha", json=dados).status_code, 400)
        self.assertEqual(self.login().status_code, 401)
        self.assertEqual(self.login("NovaSenha123!").status_code, 200)

    def test_token_expirado(self):
        self.cadastrar()
        with SessionLocal() as db:
            db.add(Token(digest=hash_token("x" * 32), usuario_id=1,
                         finalidade="recuperacao", expira=int(time.time()) - 1))
            db.commit()
        self.assertEqual(self.client.post("/redefinir-senha", json={
            "token": "x" * 32, "senha": "NovaSenha123!"}).status_code, 400)

    def test_origem_e_arquivos(self):
        self.assertEqual(self.client.post("/cadastro", json=self.dados,
                         headers={"Origin": "https://outro.example.com"}).status_code, 403)
        for path in ("/", "/Cadastro/cadastro.html", "/Redefinir/redefinir-senha.html",
                     "/assets/js/api.js", "/assets/js/form-auth.js"):
            self.assertEqual(self.client.get(path).status_code, 200)
        self.assertEqual(self.client.get("/banco.db").status_code, 404)
        with patch.dict(os.environ, {"SMTP_HOST": ""}):
            self.assertEqual(self.client.post("/recuperar-senha",
                             json={"email": self.dados["email"]}).status_code, 503)


def tearDownModule():
    engine.dispose()
    _temp.cleanup()
