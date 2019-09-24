import Joi from 'joi';

export default {
    // POST /api/users
    createUser: {
        body: {
            username: Joi.string().required()
        }
    },

    // UPDATE /api/users/:userId
    updateUser: {
        body: {
            username: Joi.string().required()
        },
        params: {
            userId: Joi.string()
                .hex()
                .required()
        }
    },

    createPoem: {
        body: {
            content: Joi.string().required()
        }
    },

    updatePoem: {
        body: {
            content: Joi.string().required()
        },
        params: {
            poemId: Joi.string()
                .hex()
                .required()
        }
    },

    // POST /api/auth/login
    login: {
        body: {
            username: Joi.string().required(),
            password: Joi.string().required()
        }
    }
};
