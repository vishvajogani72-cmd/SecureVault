from services.vault_service import VaultService

vault = VaultService()
old_password = "OldMaster@12345"
new_password = "NewMaster@12345"
username = "test_user"

try:
    if vault.db.vault_exists():
        print("Test skipped: Vault already exists.")
    else:
        assert vault.register_vault(username, old_password)
        print("Registration: PASS")

        assert vault.unlock_vault(username, old_password)
        print("Old password login: PASS")

        assert vault.change_master_password(old_password, new_password)
        print("Password change: PASS")

        vault.lock_vault()
        assert vault.unlock_vault(username, new_password)
        print("New password login: PASS")

        vault.lock_vault()
        assert vault.unlock_vault(username, old_password) is None
        print("Old password rejection: PASS")

finally:
    vault.close()
