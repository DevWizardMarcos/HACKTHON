"""Inicia o servidor usando a raiz do projeto, independente do diretorio atual."""

import argparse
from pathlib import Path

import uvicorn


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Servidor Infinity")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--reload", action="store_true")
    args = parser.parse_args()
    raiz = Path(__file__).resolve().parent
    uvicorn.run(
        "banco.app.main:app",
        host="127.0.0.1",
        port=args.port,
        reload=args.reload,
        reload_dirs=[str(raiz)] if args.reload else None,
    )
