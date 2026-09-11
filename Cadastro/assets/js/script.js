      document.querySelectorAll(".toggle-senha").forEach((botao) => {
        botao.addEventListener("click", () => {
          const input = botao.parentElement.querySelector("input");
          const mostrar = input.type === "password";
          input.type = mostrar ? "text" : "password";
          botao.setAttribute(
            "aria-label",
            mostrar ? "Ocultar senha" : "Mostrar senha",
          );
          botao.setAttribute("aria-pressed", String(mostrar));
        });
      });
