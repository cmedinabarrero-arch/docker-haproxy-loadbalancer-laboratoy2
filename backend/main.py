from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socket

app = FastAPI(title="Backend Service")

# Habilitar CORS para que el frontend pueda consultar sin bloqueos
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "server_id": socket.gethostname(),
        "message": "Respuesta balanceada desde FastAPI"
    }

@app.get("/api")
def read_api():
    return {
        "status": "ok",
        "server_id": socket.gethostname(),
        "data": [10, 20, 30, 40, 50]
    }