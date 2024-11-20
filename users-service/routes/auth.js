const router = require('express').Router();
const autController = require('./../controllers/auth');

// Creation d'un nouvel utilisateur
router.post('/register', autController.register);

// Authentification user
router.post('/login', autController.login);

module.exports = router;
