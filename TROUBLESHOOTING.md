# 🔧 Comprehensive Troubleshooting Guide - Ecomm Microservices

Complete troubleshooting reference for all common issues in the Ecomm application.

---

## Recent Fixes (Applied April 9, 2026)

All critical issues have been fixed:
- ✅ Hardcoded credentials removed
- ✅ User data isolation fixed (orders, carts)
- ✅ Pricing calculations corrected
- ✅ Environment configuration finalized

See: [FIXES_APPLIED.md](FIXES_APPLIED.md)

---

## 1. Database Connection Issues

### Problem: "DB_PASSWORD environment variable is required"

**Error:**
```
ValueError: DB_PASSWORD environment variable is required
```

**Root Cause:** 
Missing `DB_PASSWORD` in `.env` file

**Solution:**
```bash
# 1. Create .env from template
cp .env.example .env

# 2. Edit .env and add password
nano .env

# Add this line:
DB_PASSWORD=YourSecurePassword123!

# 3. Restart services
docker-compose down
docker-compose up
```

---

### Problem: "Cannot connect to server" or "Connection timeout"

**Error:**
```
pyodbc.Error: ('08001', '[08001]... Cannot connect to server')
sqlalchemy.exc.OperationalError: (pyodbc.Error) unable to connect
```

**Root Causes & Solutions:**

**Cause 1: SQL Server container not running**
```bash
# Check status
docker-compose ps | grep sqlserver

# Start it
docker-compose up sqlserver -d

# Wait 40 seconds (SQL Server initialization)
echo "Waiting for SQL Server to start..."
sleep 40

# Verify it's ready
docker-compose logs sqlserver | tail -20
```

**Cause 2: Password mismatch**
```bash
# Check your .env DB_PASSWORD
cat .env | grep DB_PASSWORD

# Verify it matches what you set
# If different, update .env

# Restart with new password
docker-compose down
docker-compose up
```

**Cause 3: Port 1433 already in use**
```bash
# Find what's using port 1433
lsof -i :1433

# Either kill the process, or change port in docker-compose.yml:
# services:
#   sqlserver:
#     ports:
#       - "1434:1433"  # Use 1434 instead

docker-compose up --build
```

**Cause 4: Wrong hostname**
```bash
# Inside containers, use service name (not localhost)
# File: services/*/main.py or database.py

# WRONG:
DATABASE_URL = "mssql+pyodbc://...@localhost:1433/..."

# CORRECT (if calling from another container):
DATABASE_URL = "mssql+pyodbc://...@sqlserver:1433/..."

# CORRECT (from host/docker-compose):
DATABASE_URL = "mssql+pyodbc://...@localhost:1433/..."
```

---

## 2. JWT Authentication Issues

### Problem: "Invalid token" or "JWT verification failed"

**Error:**
```
HTTPException 401: Invalid token
HTTPException 401: JWT token verification failed
ValueError: JWT signature verification failed
```

**Root Causes & Solutions:**

**Cause 1: Missing JWT_SECRET_KEY**
```bash
# Check .env
grep JWT_SECRET_KEY .env

# If missing, add it:
# Generate secure key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Add to .env
JWT_SECRET_KEY=<paste-generated-key>

# Restart services
docker-compose down && docker-compose up
```

**Cause 2: JWT_SECRET_KEY different across services**
```bash
# All services MUST use same secret
grep -r "JWT_SECRET_KEY" services/*/security.py

# All should be: os.getenv("JWT_SECRET_KEY")
# Not hardcoded values!

# Verify they're using environment variable:
docker exec auth-service printenv | grep JWT_SECRET_KEY
```

**Cause 3: Token expired**
```bash
# Check token expiration (in browser console)
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
const exp =payload.exp;
const expiresAt = new Date(exp * 1000);
console.log('Token expires:', expiresAt);

# If expired, login again or increase expiration time in .env:
ACCESS_TOKEN_EXPIRE_MINUTES=1440  # 24 hours for development
```

**Cause 4: Bearer token format wrong**
```bash
# Request MUST have "Bearer " prefix
# WRONG:
curl -H "Authorization: <token>" http://localhost:8000/...

# CORRECT:
curl -H "Authorization: Bearer <token>" http://localhost:8000/...

# Frontend: Check axios.js
# Line: config.headers.Authorization = `Bearer ${token}`;
```

---

## 3. CORS (Cross-Origin] Errors

### Problem: "Access-Control-Allow-Origin header is missing"

**Error (in Browser Console):**
```
Access to XMLHttpRequest at 'http://localhost:8001/...' 
from origin 'http://localhost:5173' 
has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Root Causes & Solutions:**

**Cause 1: CORS not enabled on API Gateway**

Edit `services/api-gateway/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware (BEFORE routes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",    # Vite dev server
        "http://localhost:3000",    # Alternative frontend
        "http://localhost",
        "*"                         # Allow all (development only!)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Then define routes...
@app.get("/health")
def health():
    pass
```

**Cause 2: Request going directly to microservice** 

Requests should go through: `Frontend → API Gateway → Microservices`

**NOT:** `Frontend → Microservice (Direct)`

Check frontend API calls:
```javascript
// WRONG (no CORS):
const response = await fetch('http://localhost:8003/products');

// CORRECT (goes through gateway):
const response = await fetch('http://localhost:8000/product/products');
```

**Verify CORS is working:**
```bash
# Make test request
curl -i -H "Origin: http://localhost:5173" http://localhost:8000/health

# Should include header:
# Access-Control-Allow-Origin: http://localhost:5173
```

---

## 4. Service Communication Failures

### Problem: "Service not found" or "Cannot reach microservice"

**Error:**
```
ConnectionError: Failed to resolve hostname 'user-service'
HTTPException 503: Service temporarily unavailable
```

**Root Cause:** Services using wrong hostname or service not running

**Solution:**

**Inside Docker containers, use service names:**
```python
# File: services/order-service/main.py

# WRONG (localhost doesn't exist in container):
user_api = "http://localhost:8002/user"

# CORRECT (service name in docker network):
user_api = "http://user-service:8002/user"
```

**Check service is running:**
```bash
# All services must be running
docker-compose ps

# Status should be "Up"
# If not:
docker-compose up -d <service-name>

# Check logs
docker-compose logs product-service
```

**Test connectivity between services:**
```bash
# From inside a container
docker exec -it auth-service bash
curl http://user-service:8002/health
curl http://product-service:8003/health
```

---

## 5. Frontend Issues

### Problem: Frontend blank or not loading

**Symptoms:**
- Blank white page
- "Cannot GET /" error
- Forever loading

**Solutions:**

**Cause 1: Frontend not running**
```bash
# Check if running
docker-compose ps | grep frontend

# Start it
docker-compose up frontend -d

# Or run locally (recommended for development):
cd frontend
npm install
npm run dev
# Frontend will be at http://localhost:5173
```

**Cause 2: Wrong VITE_API_HOST**
```bash
# Check frontend/.env
grep VITE_API_HOST frontend/.env

# Should point to where API is running
# Local development:
VITE_API_HOST=http://localhost:8000

# Production:
VITE_API_HOST=https://api.puneetdevops.online

# Restart frontend after changing
```

**Cause 3: API not accessible**
```bash
# Test API from browser console
fetch('http://localhost:8000/health')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error('API error:', e))

# Or with curl
curl http://localhost:8000/health
```

---

### Problem: "Products not loading" or blank product list

**Error:** No products shown on Home page

**Solutions:**

```bash
# 1. Check product service running
docker-compose ps | grep product-service

# 2. Seed initial data
python seed_products.py

# 3. Verify API returns products
curl http://localhost:8000/product/products | jq '.' | head -20

# 4. Check logs
docker-compose logs product-service
```

**If still not working:**

```bash
# Check database has products
docker exec -it sqlserver bash
/opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P "YourPassword"

> SELECT COUNT(*) FROM [master].[dbo].[products]
> GO

# If count is 0, data wasn't seeded
# Run: python seed_products.py
```

---

## 6. Order & Cart Issues

### Problem: "Cannot access user's orders" or "Wrong user data showing"

**This is FIXED!** Each user now has own orders.

Verify the fix:
```bash
# 1. Login as user1
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1@test.com","password":"pass123"}'

# Get TOKEN1

# 2. Get user1's orders
curl -H "Authorization: Bearer $TOKEN1" \
  http://localhost:8000/order/orders

# 3. Login as user2 (get TOKEN2)
# 4. Get user2's orders
# They should be different!
```

---

### Problem: "Cart shows wrong prices" or "All items $100"

**This is FIXED!** Prices now come from product database.

**Verify:**
1. Add items to cart
2. Prices should match product prices
3. Total should be sum of (price × quantity)

---

## 7. Debugging Commands

### View Logs
```bash
# All services
docker-compose logs

# Specific service (last 100 lines)
docker-compose logs --tail=100 auth-service

# Follow logs (live)
docker-compose logs -f product-service

# Search logs
docker-compose logs | grep -i "error"
docker-compose logs | grep -i "connection"
```

### Check Service Status
```bash
# All containers
docker-compose ps

# Detailed info
docker-compose ps -a

# Just names
docker-compose ps --services
```

### Test Connectivity
```bash
# Test API endpoint
curl -v http://localhost:8000/health

# Test from inside container
docker exec auth-service curl http://product-service:8003/health

# Check port is open
netstat -an | grep 8000
lsof -i :8000
```

### Environment Variables
```bash
# Check .env is correct
cat .env | grep -E "DB_|JWT_"

# Check variables in running container
docker exec auth-service printenv | grep DB_PASSWORD

# Verify service sees them
docker-compose config  # Shows resolved docker-compose.yml
```

### Database Debugging
```bash
# Connect to SQL Server
docker exec -it sqlserver bash

# Inside container:
/opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P "YourPassword"

# List tables
> SELECT * FROM INFORMATION_SCHEMA.TABLES
> GO

# Check specific data
> SELECT * FROM [master].[dbo].[users]
> GO

# Exit
> EXIT
```

---

## 8. Complete Reset

**Warning: This deletes all data!**

```bash
# Stop everything
docker-compose down

# Remove volumes (DELETE DATA)
docker-compose down -v

# Remove old containers/images
docker system prune -a -f

# Fresh start
docker-compose up --build

# Wait for startup
sleep 40

# Seed data
python seed_products.py
```

---

## 9. Pre-Launch Checklist

Run before going live:

```bash
# ✓ Database accessible
curl http://localhost:8000/health

# ✓ All services running
docker-compose ps

# ✓ Can get products
curl http://localhost:8000/product/products | head -10

# ✓ Frontend loads
curl http://localhost:5173

# ✓ Can register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# ✓ Can login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test@test.com","password":"test123"}'

# ✓ Auth token works
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test@test.com","password":"test123"}' | jq -r '.access_token')

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/order/orders
```

---

## 📚 Related Documentation

- [FIXES_APPLIED.md](FIXES_APPLIED.md) - Detailed fixes for all issues
- [QUICK_FIX.md](QUICK_FIX.md) - Quick reference guide
- [.env.example](.env.example) - Environment variables reference
- [docker-compose.yml](docker-compose.yml) - Service configuration
- [README.md](README.md) - Setup instructions

---

**Last Updated:** April 9, 2026
**Status:** Fixed

### Symptom:
Background images on the login page failed to load.

### Fix:
- Generated a local cinematic background image.
- Placed it in `frontend/public/background.png`.
- Updated `Login.jsx` to use the relative path `/background.png`.

---

## 5. Slow Docker Builds
**Status:** Optimized Dockerfiles, Action Required from User

### Symptom:
Docker builds take an extremely long time (e.g., 500s+).

### Identified Causes:
1. **CPU Emulation**: Building `linux/amd64` images on Apple Silicon (ARM) requires QEMU emulation, which significantly slows down package installation and compilation.
2. **Disabling Cache**: Using the `--no-cache` flag forces Docker to re-download and re-compile everything (like ODBC drivers and `pyodbc`) every time, even if only a small line of code changed.

### Fixes & Recommendations:
- **Enable Caching**: **DO NOT** use `--no-cache` unless absolutely necessary. Docker is smart enough to only rebuild layers that have changed.
- **Dockerfile Optimization**: I have optimized the `Dockerfile` for `auth-service` and `api-gateway` to consolidate heavy `apt-get` operations into fewer layers, which helps the cache work more effectively.
- **Recommended Build Command**:
  ```bash
  docker buildx build --platform linux/amd64 -t <tag> --push .
  ```
  (Removed `--no-cache`)

---

## Debugging Commands

### Check Gateway Logs (Real-time)
```bash
kubectl logs -f deployment/api-gateway
```

### Check Auth Service Logs
```bash
kubectl logs -f deployment/auth-service
```
