# User Service ⚙️

Bhai! Ye ek Backend (Internal) service hai. Iska kaam sirf aur sirf User Details (Profile, Address, Info) se judi chizo ko handle karna hai. 

## 🐳 Docker Image Kis Naam se Banegi?
Aap terminal mein jaakar command chalaoge:
`docker build -t user-service:latest .`
Toh aapki image ban jayegi jiska naam hamesha **`user-service:latest`** hoga.

## 🛠️ Agar Aap Khud Dockerfile Likhein Toh Kya Steps Likhne Honge?
Kyunki is service ko Microsoft SQL (Database) se baat karni hai, toh iski Dockerfile mein SQL driver daalne padte hain. Bacchon jaisa step-by-step samjho:

1. **`FROM python:3.10-slim as builder`** 
   - *(Pehli machine/computer liya, jisme hum packages install karenge).*
2. **`RUN apt-get install -y gcc g++ unixodbc-dev`** 
   - *(Database se connect karne ke liye C++ ke zaroori tools install kiye).*
3. **`COPY requirements.txt .` & `RUN pip install ...`** 
   - *(Python ke andar list of pacakges dalkar saare python tools download kar liye).*
4. **`FROM python:3.10-slim`** 
   - *(Ab builder machine ka kaam khatam! Code final karne ke liye dusri nect aur patli machine li).*
5. **`RUN apt-get install -y msodbcsql18`** 
   - *(Is nayi patli machine mein sirf SQL se baat karne wala Microsoft ka driver (msodbcsql18) daal diya).*
6. **`COPY --from=builder ...`** 
   - *(Pehli machine (builder) mein jo python tools ready kiye the, wo uthakar dusri machine mein la dale).*
7. **`COPY . .`** 
   - *(Aapki service ka main.py aur baaki code file is machine mein daal diya).*
8. **`CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]`** 
   - *(Service ko command diya ki aaram se port 8002 par startup ho jao).*

## ☸️ Kubernetes Settings (Host aur Path)
**Bhai BIKUL DHYAN SE SUNNA:**
Is service ko koi Insan ya Browser *directly* access nahi karega. (Ingress Rule Nahi lagega).

- **Host Kya Hoga:** Kuch nahi! (Zero/None)
- **Path Kya Hoga:** Kuch nahi! (Zero/None)

### Yeh Kaam Kaise Karega Phir?
Is service se sirf hamara apna darban, **API Gateway** hi baat karega. Kubernetes in saari backend services ko ek "Internal Name" de deta hai. 
Jab bhi API Gateway ko User Info leni hogi, wo chup chap Kubernetes ke andar `http://user-service:8002` bulakar apka data utha lega. Isiliye hume isey public Host ya Path dekar duniya ko expose karne ki koi jaroorat hi nahi!
