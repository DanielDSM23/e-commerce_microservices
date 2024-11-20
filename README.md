# README - Architecture Microservices pour une Application E-Commerce

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
git clone https://github.com/votre-repo/microservices-ecommerce.git 
```

Démarrer l'application avec docker

```sh
docker compose up --build
```