# Infinity — frontend e backend

Requer Python 3.10 ou superior. Execute na raiz do projeto (PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python iniciar.py --reload
```

Abra http://127.0.0.1:8000. O mesmo servidor entrega as telas e a API.
O inicializador resolve os imports a partir da localização de iniciar.py.
Se ocorrer `No module named 'banco'` com o comando direto do Uvicorn,
volte à raiz HACKTHON e use o comando acima. De outra pasta, informe os
caminhos completos do Python da .venv e do iniciar.py.
Não abra os HTML diretamente ou por Live Server: a integração usa a mesma origem.
Documentação interativa: http://127.0.0.1:8000/docs.

O cadastro exige nome, CPF válido, e-mail e senha de pelo menos 8 caracteres
(máximo de 72 bytes). O login aceita CPF ou e-mail. A sessão dura 8 horas
e fica em cookie HttpOnly. Como ainda não existe uma tela interna, o login
exibe a confirmação na própria página. Google e Apple ainda não estão integrados.

O SQLite é criado em banco.db na raiz. DATABASE_URL permite outro banco.
CPFs ficam em tabela separada, preservando a tabela de usuários existente;
contas antigas sem CPF podem entrar por e-mail.

## Recuperação por e-mail

Configure as variáveis de .env.example no ambiente do processo antes de iniciar
o servidor. O arquivo .env não é carregado automaticamente. Exemplo:

```powershell
$env:PUBLIC_BASE_URL = "http://127.0.0.1:8000"
$env:SMTP_HOST = "smtp.seu-provedor.com"
$env:SMTP_PORT = "587"
$env:SMTP_FROM = "seu-remetente"
$env:SMTP_USER = "seu-usuario"
$env:SMTP_PASSWORD = "sua-senha"
```

O envio usa STARTTLS. Sem configuração, a API retorna 503 e a tela explica
que o envio está indisponível. O link expira em 30 minutos, pode ser usado uma
vez e a troca de senha encerra todas as sessões. Tokens são armazenados como hash.
Em produção, use HTTPS, COOKIE_SECURE=true e configure limites de requisições
para login e recuperação no proxy antes de expor o serviço à internet.

## Rotas

- POST /cadastro: nome, cpf, email, senha.
- POST /login: identificador, senha.
- GET /me: usuário da sessão.
- POST /logout: encerra a sessão.
- POST /recuperar-senha: email.
- POST /redefinir-senha: token, senha.

Testes: `.\.venv\Scripts\python -m unittest discover -s tests -v`.
O código ativo está em banco/app; as outras pastas de backend são rascunhos anteriores.
