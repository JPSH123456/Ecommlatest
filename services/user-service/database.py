import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Default MS SQL server connection info. We use pyodbc with TrustServerCertificate=yes
DB_SERVER = os.getenv("DB_SERVER", "localhost")
DB_PORT = os.getenv("DB_PORT", "1433")
DB_USER = os.getenv("DB_USER", "SA")
DB_PASSWORD = os.getenv("DB_PASSWORD", "SuperSecretPassword123!")
DB_NAME = os.getenv("DB_NAME", "master")

# Use DATABASE_URL directly if provided (e.g. for Azure MSSQL)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
if SQLALCHEMY_DATABASE_URL and not SQLALCHEMY_DATABASE_URL.startswith("mssql"):
    import urllib.parse
    params = urllib.parse.quote_plus(SQLALCHEMY_DATABASE_URL)
    SQLALCHEMY_DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={params}"
elif not SQLALCHEMY_DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = (
        f"mssql+pyodbc://{DB_USER}:{DB_PASSWORD}@{DB_SERVER}:{DB_PORT}/{DB_NAME}"
        "?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes"
    )

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
