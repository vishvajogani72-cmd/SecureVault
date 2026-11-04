import sqlite3

connection = sqlite3.connect(
    "file:securevault_api_test.db?mode=ro",
    uri=True
)

cursor = connection.cursor()
cursor.execute("SELECT username FROM vault_config WHERE id = 1")

result = cursor.fetchone()

if result:
    print("Registered username:", result[0])
else:
    print("No vault configuration found.")

connection.close()