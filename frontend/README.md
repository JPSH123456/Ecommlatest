# Frontend Service 🖥️

Mere bhai! Ye hamare e-commerce ki website hai jo user ko screen par dikhti hai. 

## 🐳 Docker Image Kis Naam se Banegi?
Image ka naam hamesha simple rakhte hain. Iske liye aap command chalaoge:
`docker build -t frontend:latest .`
Toh image ka naam banega: **`frontend:latest`**

## 🛠️ Agar Aap Khud Dockerfile Likhein Toh Kya Steps Likhne Honge?
Agar aapko apne hath se Dockerfile banani ho toh ye steps dhyan mein rakhna (Bacchon ki bhasha mein):

1. **`FROM node:22-alpine as builder`** 
   - *(Samjho ek naya blank computer liya jisme Node.js pehle se hai, iska naam 'builder' rakha).*
2. **`WORKDIR /app`** 
   - *(Computer ke andar ek '/app' naam ka folder banaya, ab sara kaam yahin hoga).*
3. **`COPY package*.json ./`** 
   - *(Apne laptop se list of tools 'package.json' ko computer mein daala).*
4. **`RUN npm install`** 
   - *(Computer ko bola ki bhai 'package.json' padh ke saare tools internet se download kar lo).*
5. **`COPY . .`** 
   - *(Ab apna bacha hua saara design aur code computer mein daal diya).*
6. **`RUN npm run build`** 
   - *(Computer ne code padha aur final fast website bana di 'dist' folder ke andar).*
7. **`FROM nginx:alpine`** 
   - *(Ab dusra ek chota aur fast web-server computer liya jisme Nginx hai).*
8. **`COPY --from=builder /app/dist /usr/share/nginx/html`** 
   - *(Pehle wale 'builder' computer se bani hui final website li, aur naye computer mein dal di).*
9. **`EXPOSE 80`** 
   - *(Naye computer mein port 80 open kar diya, yahi par Nginx chalta hai).*
10. **`CMD ["nginx", "-g", "daemon off;"]`** 
    - *(Computer ko command di ki Nginx Server start kar do aur chup-chap chalte raho).*

## ☸️ Kubernetes Settings (Host aur Path)
**Yeh service bahar (User) walon ko dikhani hai!**
- **Host Kya Hoga:** Aap koi bhi domain le sakte ho, jaise `shop.local` (Agar Ingress use kar rahe ho to host me ye dalega).
- **Path Kya Hoga:** `/` (Kyunki jab user `shop.local` type karega browser me, toh direct hamari website khulni chahiye).
- **Baat pate ki:** Ye Frontend baki kisi internal service se directly baat nahi karega, yeh sirf **API Gateway** ko request bhejega.`
