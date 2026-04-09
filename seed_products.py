import requests
import os

API_URL = os.getenv("API_URL", "http://localhost:8000")

print("Registering system user...")
try:
    requests.post(f"{API_URL}/auth/register", json={"email": "system@shopcart.com", "password": "password123"})
except Exception as e:
    pass

print("Logging in...")
res = requests.post(f"{API_URL}/auth/login", data={"username": "system@shopcart.com", "password": "password123"})
token = res.json().get("access_token")
if not token:
    print("Login failed! Ensure backend is running.")
    exit(1)

headers = {"Authorization": f"Bearer {token}"}

products = [
    {
        "name": "Apple iPhone 15 Pro Max (256 GB)",
        "description": "Premium flagship smartphone with A17 Pro chip and Titanium build.",
        "price": 1199.00,
        "stock": 50,
        "category": "Electronics",
        "image_url": "https://m.media-amazon.com/images/I/81Os1SDWpcL._AC_SL1500_.jpg"
    },
    {
        "name": "Sony WH-1000XM5 Wireless Headphones",
        "description": "Industry Leading Noise Canceling with Auto Noise Canceling Optimizer.",
        "price": 348.00,
        "stock": 120,
        "category": "Audio",
        "image_url": "https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SL1000_.jpg"
    },
    {
        "name": "Apple MacBook Pro 16-inch M3 Max",
        "description": "16-core CPU, 40-core GPU, 48GB Unified Memory, 1TB SSD Storage.",
        "price": 3999.00,
        "stock": 10,
        "category": "Computers",
        "image_url": "https://m.media-amazon.com/images/I/618d5bS2lUL._AC_SL1500_.jpg"
    },
    {
        "name": "Logitech MX Master 3S Wireless Mouse",
        "description": "Ultra-fast scrolling, Ergonomic, 8K DPI track-on-glass.",
        "price": 99.00,
        "stock": 350,
        "category": "Accessories",
        "image_url": "https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SL1500_.jpg"
    },
    {
        "name": "Samsung 49 Odyssey G9 Gaming Monitor",
        "description": "DQHD, 240Hz, 1ms, G-Sync and FreeSync Premium Pro.",
        "price": 1299.99,
        "stock": 15,
        "category": "Gaming",
        "image_url": "https://m.media-amazon.com/images/I/71it2biogvL._AC_SL1500_.jpg"
    }
]

for p in products:
    r = requests.post(f"{API_URL}/product/products", json=p, headers=headers)
    print(f"Added {p['name']}: {r.status_code}")

print("Done! Refresh the frontend page.")
