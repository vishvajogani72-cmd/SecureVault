
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from secrets import token_urlsafe, compare_digest

from services.vault_service import VaultService


# --------------------------------------------------
# Application Setup
# --------------------------------------------------

vault = VaultService()
active_token = None
security = HTTPBearer()

app = FastAPI(
    title="SecureVault API",
    description="Personal Password Manager",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Request Models
# --------------------------------------------------

class PasswordRequest(BaseModel):
    username: str
    master_password: str


class CredentialRequest(BaseModel):
    website: str
    username: str
    password: str


class UpdateCredentialRequest(BaseModel):
    website: str
    username: str
    password: str


class ChangeMasterPasswordRequest(BaseModel):
    old_password: str
    new_password: str = Field(min_length=12)


# --------------------------------------------------
# Authentication
# --------------------------------------------------

def verify_session(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    if active_token is None or not compare_digest(
        credentials.credentials,
        active_token
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired session"
        )


# --------------------------------------------------
# Home and Health
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Welcome to SecureVault",
        "status": "API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "application": "SecureVault"
    }


# --------------------------------------------------
# Register
# --------------------------------------------------

@app.post("/register")
def register(request: PasswordRequest):

    if vault.db.vault_exists():
        raise HTTPException(
            status_code=409,
            detail="Vault already exists"
        )

    if len(request.master_password) < 12:
        raise HTTPException(
            status_code=400,
            detail="Master password must be at least 12 characters"
        )

    success = vault.register_vault(
        request.username,
        request.master_password
    )

    if not success:
        raise HTTPException(
            status_code=400,
            detail="Vault registration failed"
        )

    return {
        "message": "Vault registered successfully"
    }


# --------------------------------------------------
# Login
# --------------------------------------------------

@app.post("/login")
def login(request: PasswordRequest):
    global active_token

    if not vault.db.vault_exists():
        raise HTTPException(
            status_code=404,
            detail="No vault registered"
        )

    result = vault.unlock_vault(
        request.username,
        request.master_password
    )

    if result is None:
        raise HTTPException(
            status_code=401,
            detail="Incorrect master password"
        )

    active_token = token_urlsafe(32)

    return {
        "message": "Vault unlocked successfully",
        "access_token": active_token,
        "token_type": "bearer"
    }


# --------------------------------------------------
# Logout
# --------------------------------------------------

@app.post("/logout")
def logout(
    authenticated: None = Depends(verify_session)
):
    global active_token

    vault.lock_vault()
    active_token = None

    return {
        "message": "Vault locked successfully"
    }


# --------------------------------------------------
# Add Credential
# --------------------------------------------------

@app.post("/credentials")
def add_credential(
    request: CredentialRequest,
    authenticated: None = Depends(verify_session)
):
    credential_id = vault.add_credential(
        request.website,
        request.username,
        request.password
    )

    if not credential_id:
        raise HTTPException(
            status_code=400,
            detail="Could not save credential"
        )

    return {
        "message": "Credential saved successfully",
        "id": credential_id
    }


# --------------------------------------------------
# View Credentials
# --------------------------------------------------

@app.get("/credentials")
def get_credentials(
    authenticated: None = Depends(verify_session)
):
    credentials = vault.get_credentials()

    return {
        "credentials": credentials
    }


# --------------------------------------------------
# Search Credentials
# --------------------------------------------------

@app.get("/credentials/search")
def search_credentials(
    website: str,
    authenticated: None = Depends(verify_session)
):
    results = vault.search_credentials(website)

    return {
        "credentials": results
    }


# --------------------------------------------------
# Update Credential
# --------------------------------------------------

@app.put("/credentials/{credential_id}")
def update_credential(
    credential_id: int,
    request: UpdateCredentialRequest,
    authenticated: None = Depends(verify_session)
):
    success = vault.update_credential(
        credential_id,
        request.website,
        request.username,
        request.password
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Credential not found or update failed"
        )

    return {
        "message": "Credential updated successfully"
    }


# --------------------------------------------------
# Delete Credential
# --------------------------------------------------

@app.delete("/credentials/{credential_id}")
def delete_credential(
    credential_id: int,
    authenticated: None = Depends(verify_session)
):
    success = vault.delete_credential(credential_id)

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Credential not found"
        )

    return {
        "message": "Credential deleted successfully"
    }


# --------------------------------------------------
# Change Master Password
# --------------------------------------------------

@app.post("/change-master-password")
def change_master_password(
    data: ChangeMasterPasswordRequest,
    authenticated: None = Depends(verify_session)
):
    success = vault.change_master_password(
        data.old_password,
        data.new_password
    )

    if not success:
        raise HTTPException(
            status_code=400,
            detail="Incorrect current password or unable to change master password."
        )

    return {
        "message": "Master password changed successfully"
    }
