
from security.key_manager import KeyManager
from database.db_manager import DatabaseManager
from security.encryption import EncryptionManager
from cryptography.exceptions import InvalidTag
import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from security.key_derivation import KeyDerivation

class VaultService:

    def __init__(self):
     self.key_manager = KeyManager()
     self.db = DatabaseManager("securevault_api_test.db")
     self.db.create_tables()
     self.vault_key = None

    # Register a new vault

    def register_vault(self, username, master_password):

     if self.db.vault_exists():
        print("Vault already exists!")
        return False

     if not username or not master_password:
        print("Username and master password are required!")
        return False

     salt, nonce, encrypted_key = self.key_manager.create_vault_key(
        master_password
    )

     self.db.save_vault_config(
        username,
        salt,
        encrypted_key,
        nonce
    )

     print("SecureVault registered successfully!")
     return True

    # Unlock the vault


    def unlock_vault(self, username, master_password):
     self.vault_key = None

     if not username or not master_password:
        print("Username and master password are required!")
        return None

     config = self.db.get_vault_config()

     if config is None:
        print("No vault found! Please register first.")
        return None

     stored_username, salt, encrypted_key, nonce = config

     if stored_username != username:
        print("Incorrect username!")
        return None

     try:
        vault_key = self.key_manager.unlock_vault_key(
            master_password,
            salt,
            nonce,
            encrypted_key
        )

        self.vault_key = vault_key
        self.db.log_activity("Vault unlocked")

        print("Vault unlocked successfully!")
        return vault_key

     except InvalidTag:
        print("Incorrect master password!")
        return None

    # Add a new credential
    def add_credential(self, website, username, password):

     if self.vault_key is None:
        print("Vault is locked! Please login first.")
        return False

     if not website or not username or not password:
        print("All fields are required!")
        return False

     encryption = EncryptionManager(self.vault_key)

     encrypted_password, nonce = encryption.encrypt(password)

     credential_id = self.db.add_credential(
        website,
        username,
        encrypted_password,
        nonce
     )

     self.db.log_activity("Credential added")

     print("Credential added successfully!")
     return credential_id

    # View all credentials
    def get_credentials(self):

        if self.vault_key is None:
            print("Vault is locked! Please login first.")
            return []

        records = self.db.get_credentials()
        encryption = EncryptionManager(self.vault_key)

        credentials = []

        for credential_id, website, username, encrypted_password, nonce in records:

            try:
                password = encryption.decrypt(
                    encrypted_password,
                    nonce
                )

            except InvalidTag:
                print(
                    f"Could not decrypt credential ID {credential_id}."
                )
                continue

            credentials.append({
                "id": credential_id,
                "website": website,
                "username": username,
                "password": password
            })

        return credentials

    # Search credentials by website
    def search_credentials(self, website):

        if self.vault_key is None:
            print("Vault is locked! Please login first.")
            return []

        if not website:
            print("Please enter a website to search!")
            return []

        records = self.db.search_credentials(website)
        encryption = EncryptionManager(self.vault_key)

        credentials = []

        for credential_id, site, username, encrypted_password, nonce in records:

            try:
                password = encryption.decrypt(
                    encrypted_password,
                    nonce
                )

            except InvalidTag:
                print(
                    f"Could not decrypt credential ID {credential_id}."
                )
                continue

            credentials.append({
                "id": credential_id,
                "website": site,
                "username": username,
                "password": password
            })

        return credentials

    # Update an existing credential
    def update_credential(self, credential_id, website, username, password):

     if self.vault_key is None:
        print("Vault is locked! Please login first.")
        return False

     if not website or not username or not password:
        print("All fields are required!")
        return False

     encryption = EncryptionManager(self.vault_key)

     encrypted_password, nonce = encryption.encrypt(password)

     updated = self.db.update_credential(
        credential_id,
        website,
        username,
        encrypted_password,
        nonce
    )

     if updated:
        self.db.log_activity("Credential updated")
        print("Credential updated successfully!")
        return True

     print("Credential ID not found!")
     return False


    # Lock the vault
    def lock_vault(self):

        self.vault_key = None
        self.db.log_activity("Vault locked")
        print("Vault locked successfully!")

    # Close database connection
    def close(self):

        self.lock_vault()
        self.db.close_connection()
        # Delete an existing credential
    def delete_credential(self, credential_id):

     if self.vault_key is None:
        print("Vault is locked! Please login first.")
        return False

     deleted = self.db.delete_credential(credential_id)

     if deleted:
        self.db.log_activity("Credential deleted")
        print("Credential deleted successfully!")
        return True

     print("Credential ID not found!")
     return False

    def change_master_password(self, old_password, new_password):

     if not old_password or not new_password:
        print("Both passwords are required!")
        return False

     if len(new_password) < 12:
        print("New master password must be at least 12 characters.")
        return False

     config = self.db.get_vault_config()

     if config is None:
        print("No vault found!")
        return False

    # Database returns 4 values.
     username, salt, encrypted_key, nonce = config

     try:
        # Verify old password and recover the existing vault key.
        vault_key = self.key_manager.unlock_vault_key(
            old_password,
            salt,
            nonce,
            encrypted_key
        )

     except InvalidTag:
        print("Incorrect old master password!")
        return False

    # Generate new salt and nonce.
     new_salt = KeyDerivation.generate_salt()
     new_nonce = os.urandom(12)

    # Derive a new encryption key.
     derivation = KeyDerivation(new_salt)
     derived_key = derivation.derive_key(new_password)

    # Encrypt the SAME vault key using the new derived key.
     new_encrypted_key = AESGCM(derived_key).encrypt(
        new_nonce,
        vault_key,
        b"SecureVault:v1"
    )

    # Update only vault encryption configuration.
     updated = self.db.update_vault_config(
        new_salt,
        new_encrypted_key,
        new_nonce
    )

     if updated:
        self.vault_key = vault_key
        self.db.log_activity("Master password changed")

        print("Master password changed successfully!")
        return True

     return False
