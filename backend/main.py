from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socket

app = FastAPI(title="Backend Service")

# Habilitar CORS
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
        "message": "Respuesta balanceada desde FastAPI (Raiz)"
    }

@app.get("/api")
@app.get("/api/")
def read_api():
    return {
        "status": "healthy",
        "server_id": socket.gethostname(),
        "message": "Respuesta balanceada desde FastAPI (/api)",
        "data": [10, 20, 30, 40, 50]
    }