require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT;
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const apiRouter = require('./routes');
const cors = require('cors');


app.use((req, res, next) => {
    console.log(`Requête reçue : ${req.method} ${req.url}`);
    next();
});

// Autorise l'accès exterieur au serveur
app.use(cors());

//Parse des requetes en JSON
app.use(express.json());

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Book API',
            version: '1.0.0'
        }
    },
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

//Connection BDD avec mongoose
mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('Database connected');
    })
    .catch((error) => {
        console.log(`Database connection error ${error}`);
    });

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Recuperation des definitions de routes
app.use('/api/', apiRouter);

//Lance le server sur le port renseigné
app.listen(port, () => {
    console.log('server is running');
});
