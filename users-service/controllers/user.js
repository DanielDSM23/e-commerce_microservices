const mongoose = require('mongoose');

module.exports = {
    getUserInfos: (req, res) => {
        const { id, firstname, lastname, email } = req.user;
        res.send({
            id,
            firstname,
            lastname,
            email
        });
    },

};
