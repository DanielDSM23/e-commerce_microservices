const OrderModel = require('../models/Order');
const { verifyUser } = require('../validator/order');

module.exports = {


    createCommand: async (req, res) => {
        try {
            //ajouter la route de cart pour supprimer par rapport au user.
        } catch (error) {
            res.send({
                message: error.message
            });
        }
    },

    readCommand: async (req, res) => {
        try {
            const { commandId } = req.params;
            console.log(`[GET COMMAND] Request received: commandId=${commandId}`);

            try {
                const order = await OrderModel.find({ id: commandId }).populate('items.productId');
                console.log(`[GET COMMAND] Cart found: ${order}`);

                if (!order) {
                    res.status(404).json({ message: 'Commande non trouvé' });
                } else {
                    res.status(200).json(cart);
                }
            } catch (error) {
                console.error(`[GET COMMAND] Error: ${error}`);
                res.status(500).json({ message: 'Erreur lors de la récupération de la commande', error });
            }
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
