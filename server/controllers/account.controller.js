import db from '../../config/sequelize';

const Account = db.Account;

/**
 * Create account
 */
async function create(req, res, next) {
    const account = {
        facebook_id: req.body.facebook_id || ''
    };

    Account.create(account)
        .then(savedAccount => res.json(savedAccount))
        .catch(e => next(e));

    return true;
}

export default { create };
