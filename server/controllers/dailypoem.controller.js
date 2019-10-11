import db from '../../config/sequelize';
import attributes from '../helpers/attributes';

const DailyPoem = db.DailyPoem;

async function getDailyTitle(req, res) {
    const lang = req.query.lang;

    if (attributes.lang.indexOf(lang) === -1) {
        return res.status(400).send({ message: 'Wrong lang' });
    }

    const response = await DailyPoem.findOne({ where: { lang: lang }, order: [['id', 'DESC']] });
    return res.json(response);
}

export default { getDailyTitle };
