const UserModel = require('./../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyUser } = require('../validator/user');
const pino = require('pino');
const logger = pino({ level: 'info' });

module.exports = {
    register: async (req, res) => {
        try {
            logger.info('[USER SERVICE] Request received to register new user.');
            verifyUser(req.body);
            const { firstname, lastname, email, password } = req.body;
            const hash = await bcrypt.hash(password, 10);

            const newUser = new UserModel({
                firstname,
                lastname,
                email,
                password: hash,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await newUser.save();

            logger.info(`[USER SERVICE] User registered successfully. User ID: ${newUser._id}`);

            res.status(201).send({
                id: newUser._id,
                lastname: newUser.lastname,
                firstname: newUser.firstname,
                email: newUser.email
            });
        } catch (error) {
            logger.error(`[USER SERVICE] Error during user registration: ${error.message}`);
            res.send({
                message: error.message || 'Cannot register User'
            });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        logger.info(`[USER SERVICE] Login attempt for email: ${email}`);

        try {
            const user = await UserModel.findOne({ email });

            if (!user) {
                logger.error(`[USER SERVICE] User with email ${email} does not exist.`);
                res.status(401).send({
                    message: 'User not exist'
                });
                return;
            }

            const checkPassword = await bcrypt.compare(password, user.password);
            if (checkPassword) {
                const jwtOptions = {
                    expiresIn: process.env.JWT_TIMOEOUTE_DURATION || '1h'
                };
                const secret = process.env.JWT_SECRET || 'secret';

                const token = jwt.sign(
                    {
                        userId: user.id
                    },
                    secret,
                    jwtOptions
                );

                logger.info(`[USER SERVICE] Login successful for user ID: ${user.id}`);
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
                logger.error(`[USER SERVICE] Incorrect password attempt for user: ${email}`);
                res.status(401).send({
                    message: 'Wrong login information'
                });
            }
        } catch (error) {
            logger.error(`[USER SERVICE] Error during login: ${error.message}`);
            res.status(500).send({
                message: 'Internal Server Error',
                error: error.message
            });
        }
    }
};
