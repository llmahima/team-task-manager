from sqlalchemy import create_engine, inspect, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"Connecting to: {DATABASE_URL}")

engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        # Check columns
        insp = inspect(engine)
        print("Columns in 'users' table:", [c['name'] for c in insp.get_columns('users')])
        
        # Check Enums in Postgres
        enums = conn.execute(text("""
            SELECT t.typname, array_agg(e.enumlabel)
            FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            GROUP BY t.typname
        """)).all()
        print("Enums in database:", enums)
except Exception as e:
    print(f"Error: {e}")
