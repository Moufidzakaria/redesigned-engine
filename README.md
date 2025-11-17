# 🚀 Redesigned Engine

![Node.js](https://img.shields.io/badge/Node.js-20-green?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0-blue?style=flat-square&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7.0-orange?style=flat-square&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Container-blue?style=flat-square&logo=docker&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-Chrome-purple?style=flat-square&logo=playwright&logoColor=white)
![CI](https://img.shields.io/github/actions/workflow/status/Moufidzakaria/redesigned-engine/ci-docker-nodejs.yml?style=flat-square&logo=github&logoColor=white)

**Redesigned Engine** est une solution avancée pour le **scraping de produits e-commerce**, rapide, scalable et sécurisée.  
Elle collecte les données depuis des sites comme Jumia, les stocke dans MongoDB et utilise Redis pour accélérer les requêtes.

---

## 🎯 Valeur pour les entreprises

* 💡 **Analyse concurrentielle** : suivi des prix et disponibilité des produits  
* 📊 **Décisions basées sur les données** : données fiables pour stratégies marketing  
* ⚡ **Rapidité** : Redis pour réduire le temps de réponse  
* 🏗️ **Scalabilité** : architecture prête pour des millions de produits  
* 🚀 **Déploiement rapide** : Docker, prêt pour cloud ou serveur interne  

---

## 🛠️ Stack technique

| Composant    | Technologie                 
|------------|------------------------------|-
| Backend    | Node.js + Express            | 
| Scraping   | Playwright (Chrome headless) | 
| Base de données | MongoDB 5.0                  
| Cache      | Redis 7.0                    | 
| Conteneurs | Docker & Docker Compose      | 
| CI/CD      | GitHub Actions               | 

---

## ⚡ Démarrage rapide

1️⃣ **Cloner le projet :**
```bash
git clone https://github.com/Moufidzakaria/redesigned-engine.git
cd redesigned-engine
docker-compose up -d --build
App: http://localhost:3000

Mongo Express: http://localhost:8081  GET /scrape      # Lance le scraping et sauvegarde les produits dans DB et Redis
GET /products    # Récupère les produits rapidement (cache Redis)
             +-----------------+
           |   My App Node   |
           |  (Express API)  |
           +--------+--------+
                    |
       +------------+------------+
       |                         |
+------+-------+          +------+-------+
|  MongoDB     |          |    Redis     |
|  Database    |          |   Cache      |
+------+-------+          +------+-------+
       |
+------+-------+
| Mongo Express|
| (GUI Admin)  |
+--------------+

