window.api = async function (rota, dados) {
  if (location.protocol === "file:") {
    throw new Error("Abra o site em http://127.0.0.1:8000 com o backend iniciado.");
  }
  let resposta;
  try {
    resposta = await fetch(rota, {
      method: dados === undefined ? "GET" : "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: dados === undefined ? undefined : JSON.stringify(dados),
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor.");
  }
  const resultado = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    const detalhe = resultado.detail;
    throw new Error(Array.isArray(detalhe)
      ? detalhe.map(item => item.msg).join(" ")
      : detalhe || "Não foi possível concluir a solicitação.");
  }
  return resultado;
};
