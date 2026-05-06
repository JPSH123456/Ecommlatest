import os
import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

def parse_password_from_url(url: str):
    """Robustly extracts password from ODBC strings or URIs"""
    if not url: return os.getenv("DB_PASSWORD", "")
    if "Pwd=" in url:
        for part in url.split(";"):
            if part.strip().startswith("Pwd="): return part.split("=", 1)[1]
    try:
        parsed = urllib.parse.urlparse(url)
        if parsed.password: return urllib.parse.unquote(parsed.password)
    except: pass
    return ""

def get_db_url():
    url = os.getenv("DB-URL")
    if not url and os.path.exists("/data/DB-URL"):
        try:
            with open("/data/DB-URL", "r") as f:
                url = f.read().strip().replace("\n", "").replace("\r", "")
        except Exception: pass
    if not url:
        kv_url = os.getenv("KEYVAULT_URL")
        if kv_url:
            try:
                from azure.identity import DefaultAzureCredential
                from azure.keyvault.secrets import SecretClient
                client = SecretClient(vault_url=kv_url, credential=DefaultAzureCredential())
                url = client.get_secret("DB-URL").value
            except Exception: pass

    if url:
        if "Driver=" in url or ";" in url:
            import urllib.parse
            if "TrustServerCertificate=no" in url:
                url = url.replace("TrustServerCertificate=no", "TrustServerCertificate=yes")
            elif "TrustServerCertificate=" not in url:
                url += ";TrustServerCertificate=yes"
            params = urllib.parse.quote_plus(url)
            return f"mssql+pyodbc:///?odbc_connect={params}"
        return url

    import urllib.parse
    user = os.getenv("DB_USER", "SA")
    pwd = urllib.parse.quote_plus(os.getenv("DB_PASSWORD", ""))
    server = os.getenv("DB_SERVER", "localhost")
    port = os.getenv("DB_PORT", "1433")
    db_name = os.getenv("DB_NAME", "master")
    return f"mssql+pyodbc://{user}:{pwd}@{server}:{port}/{db_name}?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes"

SQLALCHEMY_DATABASE_URL = get_db_url()
engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
