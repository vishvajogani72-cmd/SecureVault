from fastapi import FastAPI

app = FastAPI(
    title="SecureVault API",
    description="Personal Password Manager",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to SecureVault",
        "status": "API is running"
    }