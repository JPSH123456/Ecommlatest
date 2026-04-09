# ⚡ QUICK TROUBLESHOOTING GUIDE - Ecomm App

Reference guide for common runtime issues.

## 🎯 Diagnose Your Problem

### Problem: "Cannot connect to database"
```
Error: DB_PASSWORD environment variable is required
```
**Fix:** Add to `.env`:
```
DB_PASSWORD=YourSecurePassword123!
```

### Problem: "Invalid token" / JWT errors
```
HTTPException 401: Invalid token
```
**Fix:** 
```bash
# 1. Check JWT_SECRET_KEY is set
grep JWT_SECRET_KEY .env

# 2. Generate new one if needed
python -c "import secrets; print(secrets.token_urlsafe(32))"

# 3. Add to .env:
JWT_SECRET_KEY=<paste-here>
```

### Problem: CORS error in browser
```
Access to XMLHttpRequest... blocked by CORS policy
```
**Fix:** Add to `services/api-gateway/main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Problem: "Cannot reach SQL Server"
```
pyodbc.Error: Cannot connect to server
```
**Fix:**
```bash
# Check DB is running
docker-compose ps | grep sqlserver

# Wait 30+ seconds for SQL Server to start
echo "Waiting for database..."
sleep 40

# Restart
docker-compose down
docker-compose up --build
```

### Problem: "Service not found" when services call each other
```
ConnectionError: Failed to resolve hostname
```
**Fix:** In microservice code, use service name (not localhost):
```python
# WRONG:
product_api = "http://localhost:8003"

# CORRECT:
product_api = "http://product-service:8003"
```

### Problem: Products not showing in frontend
```
Blank page or "No products found"
```
**Fix:**
```bash
# 1. Start product service
docker-compose up product-service -d

# 2. Seed data
python seed_products.py

# 3. Verify
curl http://localhost:8000/product/products
```

### Problem: "API_URL not found" in seed script
```
ValueError: API_URL environment variable not found
```
**Fix:** Add to `.env`:
```
API_URL=http://localhost:8000
```

### Problem: Frontend blank / not loading
```
GET http://localhost:5173 or 3000 returns 404
```
**Fix:**
```bash
# Check frontend is running
docker-compose logs frontend

# If not, start it:
cd frontend
npm install
npm run dev
```

### Problem: Orders/Cart showing wrong user data
```
User A can see User B's orders
```
**Note:** This is fixed! Each order now requires JWT token with user_id.

### Problem: All cart items show $100 price
```
Even expensive items show $100
```
**Note:** This is fixed! Prices now come from product database.

---

## 🔧 Quick Fix Commands

```bash
# 1. View all logs
docker-compose logs -f

# 2. Restart everything
docker-compose down && docker-compose up

# 3. Check all services running
docker-compose ps

# 4. Test API health
curl http://localhost:8000/health

# 5. Check environment variables are loaded
docker exec auth-service printenv | grep DB_PASSWORD

# 6. View error details
docker-compose logs auth-service --tail=100

# 7. Reset everything (delete data!)
docker-compose down -v && docker-compose up --build

# 8. Debug database connection
docker exec -it sqlserver bash
/opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P "YourPassword"
```

---

## 📋 Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `DB_PASSWORD required` | Not in .env | Add `DB_PASSWORD=...` |
| `JWT_SECRET_KEY required` | Not in .env | Add `JWT_SECRET_KEY=...` |
| `Cannot connect to server` | DB not running | Wait 40s, then restart |
| `403 Forbidden` | CORS issue | Add CORS middleware |
| `401 Unauthorized` | Bad token | Login again, check JWT secret |
| `Service not found` | Service crashed | Check logs, restart service |
| `Timeout` | Port blocked | Check if port in use: `lsof -i :8000` |

---

## ✅ Pre-Launch Checklist

```bash
# ✓ .env file exists and complete
ls -la .env

# ✓ All services running
docker-compose up -d
docker-compose ps

# ✓ DB is accessible
curl http://localhost:8000/health

# ✓ Products exist
curl http://localhost:8000/product/products | head -20

# ✓ Frontend loads
curl http://localhost:5173

# ✓ Can login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test@test.com","password":"pass123"}'
```

---

See full detailed guide: [FIXES_APPLIED.md](FIXES_APPLIED.md)
