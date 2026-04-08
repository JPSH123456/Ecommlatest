import os
import urllib
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# -----------------------------
# DATABASE URL CONFIGURATION
# -----------------------------
DATABASE_URL = os.getenv("DATABASE_URL")

# Fallback local SQLite (for local development)
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./local.db"

# If using Azure SQL (raw ODBC string), convert to SQLAlchemy format
if DATABASE_URL and not DATABASE_URL.startswith("mssql") and not DATABASE_URL.startswith("sqlite"):
    import urllib.parse
    params = urllib.parse.quote_plus(DATABASE_URL)
    DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={params}"

# -----------------------------
# CREATE ENGINE
# -----------------------------
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# -----------------------------
# SESSION & BASE
# -----------------------------
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# -----------------------------
# FASTAPI DEPENDENCY
# -----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()