import sqlite3
import os

DB_FILE = "db.sqlite3"  # make sure this matches your settings

if not os.path.exists(DB_FILE):
    print("Database file not found:", DB_FILE)
    exit()

conn = sqlite3.connect(DB_FILE)
cursor = conn.cursor()

try:
    cursor.execute("ALTER TABLE pacific_products_product ADD COLUMN category VARCHAR(100);")
    print("Column 'category' added successfully.")
except Exception as e:
    print("Error:", e)

conn.commit()
conn.close()
