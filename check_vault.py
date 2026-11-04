from services.vault_service import VaultService

vault = VaultService()

try:
    print("Vault exists:", vault.db.vault_exists())

    config = vault.db.get_vault_config()

    print("Vault configuration exists:", config is not None)

    if config:
        print("Salt exists:", bool(config[0]))
        print("Encrypted key exists:", bool(config[1]))
        print("Nonce exists:", bool(config[2]))

finally:
    vault.close()