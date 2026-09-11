const form = document.querySelector("form");
const cadastro = Boolean(document.getElementById("nomeCompleto"));
const mensagem = document.createElement("p");
mensagem.setAttribute("role", "status");
mensagem.setAttribute("aria-live", "polite");
form.append(mensagem);
form.querySelectorAll("input").forEach(input => input.required = true);
const senha = document.getElementById(cadastro ? "senha" : "passid");
const confirmacao = document.getElementById("confirmarSenha");
if (cadastro) {
  senha.minLength = 8;
  const validar = () => confirmacao.setCustomValidity(
    senha.value !== confirmacao.value ? "As senhas precisam ser iguais." : "");
  senha.addEventListener("input", validar);
  confirmacao.addEventListener("input", validar);
}
form.addEventListener("submit", async evento => {
  evento.preventDefault();
  if (!form.reportValidity()) return;
  const botao = form.querySelector('button[type="submit"]');
  botao.disabled = true;
  mensagem.textContent = "Aguarde...";
  try {
    if (cadastro) {
      await api("/cadastro", {
        nome: document.getElementById("nomeCompleto").value,
        cpf: document.getElementById("cpf").value,
        email: document.getElementById("email").value,
        senha: senha.value,
      });
      location.assign("/Login/login.html?cadastro=sucesso");
    } else {
      const resultado = await api("/login", {
        identificador: document.getElementById("loginid").value,
        senha: senha.value,
      });
      senha.value = "";
      mensagem.textContent = resultado.mensagem + " Bem-vindo(a), " + resultado.usuario.nome + "!";
    }
  } catch (erro) {
    mensagem.textContent = erro.message;
  } finally {
    botao.disabled = false;
  }
});
if (!cadastro && new URLSearchParams(location.search).get("cadastro") === "sucesso") {
  mensagem.textContent = "Cadastro concluído. Faça login para continuar.";
}
document.querySelectorAll(".social-btn").forEach(botao => {
  botao.addEventListener("click", evento => {
    evento.preventDefault();
    mensagem.textContent = "Login social ainda não configurado. Use CPF ou e-mail e senha.";
  });
});
