from services.vault_service import VaultService

vault = VaultService()

try:
    print("========== INVALID ID TEST ==========")

    result = vault.unlock_vault("dummy_master_password_123")

    if result:
        print("\nTesting invalid update:")
        update_result = vault.update_credential(
            9999,
            "test.com",
            "dummy_user",
            "DummyPassword@123"
        )
        print("Update result:", update_result)

        print("\nTesting invalid delete:")
        delete_result = vault.delete_credential(9999)
        print("Delete result:", delete_result)

finally:
    vault.close()
