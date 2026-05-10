import os
import urllib.parse
import struct
from sqlalchemy import create_engine, event
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
    url = os.getenv("DBURL")
    if not url and os.path.exists("/data/DBURL"):
        try:
            with open("/data/DBURL", "r") as f:
                url = f.read().strip().replace("\n", "").replace("\r", "")
        except Exception: pass
    if not url:
        kv_url = os.getenv("KEYVAULT_URL")
        if kv_url:
            try:
                from azure.identity import DefaultAzureCredential
                from azure.keyvault.secrets import SecretClient
                client = SecretClient(vault_url=kv_url, credential=DefaultAzureCredential())
                url = client.get_secret("DBURL").value
            except Exception: pass

    if url:
        if "Driver=" in url or ";" in url:
            import urllib.parse
            # Respect user preference for TrustServerCertificate=no for Azure SQL
            if "database.windows.net" in url:
                if "TrustServerCertificate=yes" in url:
                    url = url.replace("TrustServerCertificate=yes", "TrustServerCertificate=no")
                elif "TrustServerCertificate=" not in url:
                    url += ";TrustServerCertificate=no"
            else:
                # For non-Azure, keep TrustServerCertificate=yes if already there or default
                if "TrustServerCertificate=no" in url:
                    url = url.replace("TrustServerCertificate=no", "TrustServerCertificate=yes")
                elif "TrustServerCertificate=" not in url:
                    url += ";TrustServerCertificate=yes"
            
            params = urllib.parse.quote_plus(url)
            return f"mssql+pyodbc:///?odbc_connect={params}"
        return url

    import urllib.parse
    user = os.getenv("DB_USER", "SA")
    password = os.getenv("DB_PASSWORD", "")
    server = os.getenv("DB_SERVER", "localhost")
    port = os.getenv("DB_PORT", "1433")
    db_name = os.getenv("DB_NAME", "master")
    
    # If it's Azure SQL and no password is provided, we'll use token auth later in the event listener
    if "database.windows.net" in server and not password:
        # For token auth, we MUST use a clean connection string without any User/Password fields
        # Using odbc_connect format to ensure SQLAlchemy doesn't add default credentials
        driver = "ODBC Driver 18 for SQL Server"
        params = f"Driver={{{driver}}};Server=tcp:{server},{port};Database={db_name};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;"
        import urllib.parse
        quoted_params = urllib.parse.quote_plus(params)
        return f"mssql+pyodbc:///?odbc_connect={quoted_params}"
    
    pwd = urllib.parse.quote_plus(password)
    return f"mssql+pyodbc://{user}:{pwd}@{server}:{port}/{db_name}?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes"

SQLALCHEMY_DATABASE_URL = get_db_url()
engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)

@event.listens_for(engine, "do_connect")
def provide_token(dialect, conn_rec, cargs, cparams):
    # Only inject token if we are using MS SQL and it's an Azure SQL Server
    conn_str = cargs[0] if cargs else ""
    if "database.windows.net" in conn_str and ("ODBC Driver 18" in conn_str or "msodbcsql18" in conn_str.lower()):
        # Only inject if no password is provided in the connection string
        if "Pwd=" not in conn_str and "password=" not in conn_str.lower():
            from azure.identity import DefaultAzureCredential
            credential = DefaultAzureCredential()
            token = credential.get_token("https://database.windows.net/.default").token
            token_bytes = token.encode("utf-16-le")
            token_struct = struct.pack(f'<I{len(token_bytes)}s', len(token_bytes), token_bytes)
            
            # SQL_COPT_SS_ACCESS_TOKEN = 1256
            cparams["attrs_before"] = {1256: token_struct}

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
