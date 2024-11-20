const UserModel = require('./../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyUser } = require('../validator/user');

module.exports = {
    register: async (req, res) => {
        try {
            verifyUser(req.body);
            const { firstname, lastname, email, password } = req.body;
            const hash = await bcrypt.hash(password, 10);
            const newUser = new UserModel({
                firstname,
                lastname,
                email,
                password: hash,
                createdAt : new Date(),
                updatedAt : new Date()
            });

            await newUser.save();
            res.status(201).send({
                id: newUser._id,
                lastname: newUser.lastname,
                firstname: newUser.firstname,
                email: newUser.email
            });
        } catch (error) {
            res.send({
                message: error.message || 'Cannot register User'
            });
        }
    },

    // POST /login Authentification
    login: async (req, res) => {
        const { email, password } = req.body;
        const user = await UserModel.findOne({
            email // email: email
        });

        if (!user) {
            res.status(401).send({
                message: 'User not exist'
            });
            return;
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (checkPassword) {
            //prepration des infos de jwt
            const jwtOptions = {
                expiresIn: process.env.JWT_TIMOEOUTE_DURATION || '1h'
            };
            const secret = process.env.JWT_SECRET || 'secret';

            //generation du token jwt
            const token = jwt.sign(
                {
                    userId: user.id
                },
                secret,
                jwtOptions
            );

            res.send({
                message: 'Login successfully',
                user: {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    token
                }
            });
        } else {
            res.status(401).send({
                messsage: 'Wrong login informations'
            });
        }
    }
};
