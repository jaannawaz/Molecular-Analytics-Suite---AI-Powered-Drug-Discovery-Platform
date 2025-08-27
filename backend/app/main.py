from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.molecules import router as molecules_router

app = FastAPI(title="Agno ADMET API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Agno ADMET API is running.", "endpoints": ["/api/health", "/api/parse", "/api/conformer", "/api/admet", "/api/analyze"]}

app.include_router(molecules_router) 