
import sqlite3
from pathlib import Path


class DatabaseManager:

    def __init__(self, db_name):
        self.db_name = db_name

        # Find the project root directory
        project_root = Path(__file__).resolve().parent.parent

        # Create database connection

        self.connection = sqlite3.connect(
        project_root / self.db_name,
        check_same_thread=False
        )
        print("DATABASE PATH:", project_root / self.db_name)
        self.cursor = self.connection.cursor()

    def create_tables(self):

        project_root = Path(__file__).resolve().parent.parent
        schema_path = project_root / "database" / "schema.sql"

        with open(schema_path, "r", encoding="utf-8") as file:
            sql_script = file.read()

        self.cursor.executescript(sql_script)
        self.connection.commit()
    def save_vault_config(self, username, salt, encrypted_vault_key, key_nonce):

     query = """
        INSERT INTO vault_config
        (id, username, salt, encrypted_vault_key, key_nonce)
        VALUES (1, ?, ?, ?, ?)
    """

     self.cursor.execute(
        query,
        (username, salt, encrypted_vault_key, key_nonce)
    )

     self.connection.commit()

     print("Vault configuration saved successfully!")

    def close_connection(self):
        self.connection.close()
    def vault_exists(self):

     query = "SELECT id FROM vault_config WHERE id = 1"

     self.cursor.execute(query)

     result = self.cursor.fetchone()

     return result is not None

    def get_vault_config(self):
     query = """
        SELECT username, salt, encrypted_vault_key, key_nonce
        FROM vault_config
        WHERE id = 1
    """

     self.cursor.execute(query)
     result = self.cursor.fetchone()

     return result

    def add_credential(self, website, username, encrypted_password, nonce):

     query = """
        INSERT INTO credentials
        (website, username, encrypted_password, nonce)
        VALUES (?, ?, ?, ?)
    """

     self.cursor.execute(
        query,
        (website, username, encrypted_password, nonce)
     )

     self.connection.commit()

     credential_id = self.cursor.lastrowid

     print("Credential saved successfully!")
     return credential_id

    def get_credentials(self):

     query = """
        SELECT id, website, username, encrypted_password, nonce
        FROM credentials
        ORDER BY id DESC
    """

     self.cursor.execute(query)

     return self.cursor.fetchall()


    def search_credentials(self, website):
     query = """
        SELECT id, website, username, encrypted_password, nonce
        FROM credentials
        WHERE website LIKE ?
        ORDER BY id DESC
    """

     self.cursor.execute(query, (f"%{website}%",))
     return self.cursor.fetchall()



    def update_credential(
        self,
        credential_id,
        website,
        username,
        encrypted_password,
        nonce
    ):
        query = """
            UPDATE credentials
            SET website = ?,
                username = ?,
                encrypted_password = ?,
                nonce = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """

        self.cursor.execute(
            query,
            (
                website,
                username,
                encrypted_password,
                nonce,
                credential_id
            )
        )

        self.connection.commit()

        return self.cursor.rowcount > 0

    def delete_credential(self, credential_id):
     query = "DELETE FROM credentials WHERE id = ?"

     self.cursor.execute(query, (credential_id,))
     self.connection.commit()

     return self.cursor.rowcount > 0

    def log_activity(self, action):
     query = """
        INSERT INTO activity_logs (action)
        VALUES (?)
    """
     self.cursor.execute(query, (action,))
     self.connection.commit()


    def get_activity_logs(self):
     query = """
        SELECT action, timestamp
        FROM activity_logs
        ORDER BY id DESC
    """
     self.cursor.execute(query)
     return self.cursor.fetchall()

    def update_vault_config(self, salt, encrypted_vault_key, key_nonce):
     query = """
        UPDATE vault_config
        SET salt = ?, encrypted_vault_key = ?, key_nonce = ?
        WHERE id = 1
     """

     self.cursor.execute(
        query,
        (salt, encrypted_vault_key, key_nonce)
     )

     self.connection.commit()
     return self.cursor.rowcount > 0
