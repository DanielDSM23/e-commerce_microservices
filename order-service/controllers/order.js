const UserModel = require('../models/Order');
const { verifyUser } = require('../validator/order');

module.exports = {


    createCommand: async (req, res) => {
        try {

        } catch (error) {
            res.send({
                message: error.message
            });
        }
    },

    readCommand: async (req, res) => {
        try {

        } catch (error) {
            res.send({
                message: error.message
            });
        }
    },


    updateCommand: async (req, res) => {
        try {

        } catch (error){

        }


    },


    deleteCommand: async (req, res) => {
        try {

        } catch (error){

        }


    }
};
