const formularioRecuperacao = document.querySelector(".formulario-recuperacao");
const novaSenha = document.getElementById("novaSenha");
const confirmarNovaSenha = document.getElementById("confirmarNovaSenha");

document.querySelectorAll(".toggle-senha").forEach((botao) => {
  const campoSenha = document.getElementById(botao.getAttribute("aria-controls"));
  const nomeCampo = campoSenha.labels[0].textContent.toLowerCase();
  botao.addEventListener("click", () => {
    const mostrar = campoSenha.type === "password";
    campoSenha.type = mostrar ? "text" : "password";
    botao.setAttribute("aria-pressed", String(mostrar));
    botao.setAttribute("aria-label", `${mostrar ? "Ocultar" : "Mostrar"} ${nomeCampo}`);
  });
});

function validarConfirmacaoSenha() {
  if (!novaSenha || !confirmarNovaSenha) return;
  confirmarNovaSenha.setCustomValidity(
    confirmarNovaSenha.value && novaSenha.value !== confirmarNovaSenha.value
      ? "As senhas precisam ser iguais."
      : "",
  );
}

novaSenha?.addEventListener("input", validarConfirmacaoSenha);
confirmarNovaSenha?.addEventListener("input", validarConfirmacaoSenha);

if (novaSenha) novaSenha.minLength = 8;
const tokenRecuperacao = new URLSearchParams(location.search).get("token");
if (tokenRecuperacao) history.replaceState(null, "", location.pathname);

formularioRecuperacao.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  validarConfirmacaoSenha();
  if (!formularioRecuperacao.reportValidity()) return;
  const mensagem = formularioRecuperacao.querySelector(".mensagem-recuperacao");
  const botao = formularioRecuperacao.querySelector('button[type="submit"]');
  botao.disabled = true;
  mensagem.hidden = false;
  mensagem.textContent = "Aguarde...";
  try {
    const recuperar = formularioRecuperacao.dataset.etapa === "recuperar";
    if (!recuperar && !tokenRecuperacao) {
      throw new Error("Link inválido. Solicite um novo e-mail de recuperação.");
    }
    const resultado = await api(recuperar ? "/recuperar-senha" : "/redefinir-senha",
      recuperar ? { email: document.getElementById("emailRecuperacao").value }
        : { token: tokenRecuperacao, senha: novaSenha.value });
    mensagem.textContent = resultado.mensagem;
    formularioRecuperacao.reset();
    if (!recuperar) {
      const link = document.createElement("a");
      link.href = "../Login/login.html";
      link.textContent = " Ir para o login";
      mensagem.append(link);
    }
  } catch (erro) {
    mensagem.textContent = erro.message;
  } finally {
    botao.disabled = false;
  }
});
