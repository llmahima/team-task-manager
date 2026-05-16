from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    # Update to uppercase to match Enum
    conn.execute(text("UPDATE users SET role = 'MEMBER' WHERE role = 'member'"))
    conn.execute(text("UPDATE users SET role = 'ADMIN' WHERE email = 'admin@gmail.com'"))
    conn.commit()
    print("Updated existing user roles to uppercase and fixed admin.")
