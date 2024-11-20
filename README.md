# README - Architecture Microservices pour une Application E-Commerce

## Swagger
- **documentation swagger**: [ici](https://app.swaggerhub.com/apis-docs/Daniel:VRDX/MICROSERVICESECOMMERCE/1.0)

## Collection Postman

Une collection Postman est disponible pour tester les endpoints de l'API.

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/23821582-8ff83c82-42f3-45a6-a5b1-7e5b34e133ac?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D23821582-8ff83c82-42f3-45a6-a5b1-7e5b34e133ac%26entityType%3Dcollection%26workspaceId%3D621c9921-31f4-41da-af64-b4f584aacc7d)

## Introduction
Ce projet implémente une architecture microservices pour une plateforme e-commerce. Chaque microservice est indépendant et dédié à une fonctionnalité spécifique, assurant une modularité, une évolutivité et une résilience accrues.

## Structure du Projet

### Composants Principaux :
- **API Gateway**
  - Point d'entrée unique pour toutes les requêtes.
  - Vérifie les autorisations des utilisateurs.
  - Route les requêtes vers les microservices appropriés.

### Microservices :
- **Service d'Authentification** : Gère les utilisateurs et leurs sessions.
- **Service des Produits** : Permet la gestion des produits (création, mise à jour, suppression).
- **Service des Commandes** : Enregistre et suit les commandes.
- **Service des Paiements** : Gère les transactions des utilisateurs.
- **Service de Livraison** : Organise et suit les livraisons.
- **Service de Panier** : Permet la gestion des paniers utilisateurs.

## Installation

Clonez le dépôt :
```sh
git clone https://github.com/DanielDSM23/e-commerce_microservices.git 
```

Démarrer l'application avec docker

```sh
docker compose up --build
```