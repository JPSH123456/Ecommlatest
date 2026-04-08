# API Gateway Service 🚪

Bhai! Yeh hamare system ka 'Darwaza' (Gateway) hai. Frontend jab bhi database se product ki list ya user mangta hai, wo seedha is API Gateway ke paas aata hai. Phir ye Gateway decide karta hai ki order service pe jana hai ya product service pe!

## 🐳 Docker Image Kis Naam se Banegi?
Aapko command chalani hogi:
`docker build -t api-gateway:latest .`
Toh image ka naam banega: **`api-gateway:latest`**

## 🛠️ Agar Aap Khud Dockerfile Likhein Toh Kya Steps Likhne Honge?
Agar aap hath se Dockerfile likhte ho toh ye 8 simple steps hain:

1. **`FROM python:3.10-slim as builder`** 
   - *(Ek python wala machine liya, jisme sab tools hain. Isko hum builder bolenge).*
2. **`WORKDIR /app`** 
   - *(Machine mein /app ka folder banakar andar ghus gaye).*
3. **Dependencies Copy karo:** `COPY requirements.txt .` 
   - *(Bina packages ke python bekar hai, toh requirements list dali).*
4. **Tools Install:** `RUN pip install -r requirements.txt` 
   - *(Python ke andar us list ke hisab se tools install kara liye).*
5. **Dusri Machine (Slimmer):** `FROM python:3.10-slim` 
   - *(Ek dam nyay aur patli si machine dobara li).*
6. **Venv (Python Tools) Copy karo:** `COPY --from=builder /opt/venv /opt/venv` 
   - *(Pehli machine me jo dependencies bnai thi, vo dusri mein la di).*
7. **Code dalna:** `COPY . .` 
   - *(Aapka gateway wala main.py code choti machine mein dal diya).*
8. **Start karna:** `CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`
   - *(Application start kiya port 8000 par).*

## ☸️ Kubernetes Settings (Host aur Path)
**Yeh service bahar (Frontend) walo se request receive karegi.**
- **Host Kya Hoga:** `api.shop.local` (Ya `shop.local`).
- **Path Kya Hoga:** `/api`
- **Samjho Aise:** Jab frontend kisi ko data bhejna chahta hai, wo `shop.local/api` (Ya `api.shop.local/`) par request karta hai. Ingress rules mein jab bhi request `/api` pe aaye, to use seedha `api-gateway` service bhej dena. Baad me Gateway khud internal services (auth, product etc.) ko dhundh lega.

## 🕵️‍♂️ Audit Logger (Apna Spy System!)
Bhai, maine is gateway ke andar ek **Master Spy** (Audit Logger) fit kar diya hai. 
Ab Gateway chori-chhupe ek aur kaam karta hai:
1. Jaise hi request internal services ko deta hai, ye background (fast speed) me saari details utha leta hai.
2. Us bande ka **IP Address**, **Time**, aur wo kahan jaa rha tha, sab kuch Azure SQL Database (ya local DB) ki `audit_logs` table me likh leta hai.
3. Is wajah se aapki Dockerfile me extra **msodbcsql18** (Microsoft Database tool) wale steps jud gaye hain taki gateway database se direct connection bana sake!
