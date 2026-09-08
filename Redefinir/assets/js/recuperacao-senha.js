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

formularioRecuperacao.addEventListener("submit", (evento) => {
  evento.preventDefault();
  validarConfirmacaoSenha();
  if (!formularioRecuperacao.reportValidity()) return;

  // Substituir este aviso pela chamada à API quando a integração estiver pronta.
  // A redefinição real também deve validar o token recebido pelo link do e-mail.
  const mensagem = formularioRecuperacao.querySelector(".mensagem-recuperacao");
  mensagem.textContent = formularioRecuperacao.dataset.etapa === "recuperar"
    ? "O envio de recuperação ainda não está disponível."
    : "A alteração de senha ainda não está disponível.";
  mensagem.hidden = false;
});
