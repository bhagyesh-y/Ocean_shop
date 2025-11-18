import sqlite3
import os

DB_FILE = "db.sqlite3"

conn = sqlite3.connect(DB_FILE)
cursor = conn.cursor()

tables = [
    "pacific_products_product",
    "pacific_products_oceancart",
    "pacific_products_atlanticcategory"
]

for table in tables:
    try:
        cursor.execute(f"DROP TABLE IF EXISTS {table};")
        print(f"Deleted table: {table}")
    except Exception as e:
        print(f"Error deleting {table}: {e}")

conn.commit()
conn.close()

print("Cleanup complete. Now run migrations.")