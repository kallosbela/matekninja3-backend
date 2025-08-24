# Math Practice Platform - Backend API

Ez a Math Practice Platform backend API-ja, amely Node.js, Express.js és MongoDB használatával készült.

## 🚀 Gyors Indítás

```bash
# Függőségek telepítése
npm install

# Környezeti változók beállítása
cp .env.example .env
# Szerkeszd a .env fájlt a saját adataiddal

# Fejlesztői szerver indítása
npm run dev

# Éles szerver indítása
npm start
```

## 📦 Függőségek

- **Node.js** (v16+)
- **MongoDB** (Railway vagy helyi)
- **npm** vagy **yarn**

## 🌍 Környezeti Változók

Hozz létre egy `.env` fájlt a következő tartalommal:

```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📡 API Végpontok

### Authentikáció (`/api/auth`)
- `POST /register` - Felhasználó regisztráció
- `POST /login` - Bejelentkezés
- `GET /me` - Aktuális felhasználó

### Feladatok (`/api/problems`)
- `GET /` - Feladatok listázása
- `GET /topics` - Témakörök
- `GET /:id` - Feladat részletei

### Eredmények (`/api/results`)
- `POST /` - Válasz beküldése
- `GET /me` - Saját eredmények
- `GET /stats` - Statisztikák

### Tanári funkciók (`/api/teacher`)
- `POST /problems` - Feladat létrehozása
- `POST /problems/bulk` - Tömeges feltöltés
- `POST /assignments` - Feladatsor kiosztása
- `GET /students` - Tanulók listája

## 🏗️ Projekt Struktúra

```
backend/
├── config/           # Adatbázis konfiguráció
├── controllers/      # API logika
├── middleware/       # Authentikáció, jogosultság
├── models/          # MongoDB sémák
├── routes/          # API végpontok
├── scripts/         # Segédscriptek
├── .env             # Környezeti változók (git ignore)
├── .gitignore       # Git ignore fájl
├── package.json     # Projekt konfiguráció
└── server.js        # Főprogram
```

## 🛡️ Biztonság

- JWT alapú authentikáció
- Jelszó hash-elés bcryptjs-sel
- CORS védelem
- Input validáció
- Rate limiting (terv)

## 🚀 Deployment

### Railway
1. Railway projekt létrehozása
2. MongoDB service hozzáadása
3. Environment variables beállítása
4. Git repository összekötése

### Vercel/Netlify
Backend API deployment lehetséges serverless funkcióként.

## 📊 Adatbázis Sémák

- **User**: Felhasználók (tanár/diák)
- **Problem**: Feladatok (multiple choice/short answer)
- **Result**: Válaszok és eredmények
- **Assignment**: Feladatsorok

## 🧪 Tesztelés

```bash
# Health check
curl http://localhost:5000/health

# Postman/Thunder Client collection
# Importáld a docs/api-collection.json fájlt
```

## 📄 Licenc

MIT License - lásd a LICENSE fájlt.

## 🤝 Közreműködés

1. Fork a projektet
2. Feature branch létrehozása
3. Commitok és push
4. Pull Request küldése

---

Made with ❤️ for Math Practice Platform
