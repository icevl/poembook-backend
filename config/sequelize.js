import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import config from './config';

const db = {};

// connect to postgres testDb
const sequelizeOptions = {
    dialect: 'postgres',
    port: config.postgres.port,
    host: config.postgres.host,
    // NOTE: https://github.com/sequelize/sequelize/issues/8417
    // Codebase shouldn't be using string-based operators, but we still disable them
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    ...(config.postgres.ssl && {
        ssl: config.postgres.ssl
    }),
    ...(config.postgres.ssl &&
        config.postgres.ssl_ca_cert && {
            dialectOptions: {
                ssl: {
                    ca: config.postgres.ssl_ca_cert
                }
            }
        })
};
const sequelize = new Sequelize(config.postgres.db, config.postgres.user, config.postgres.passwd, sequelizeOptions);

const modelsDir = path.normalize(`${__dirname}/../server/models`);

// loop through all files in models directory ignoring hidden files and this file
fs.readdirSync(modelsDir)
    .filter(file => file.indexOf('.') !== 0 && file.indexOf('.map') === -1)
    // import model files and save model names
    .forEach(file => {
        console.log(`Loading model file ${file}`); // eslint-disable-line no-console
        const model = sequelize.import(path.join(modelsDir, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(item => (typeof db[item].associate === 'function' ? db[item].associate(db) : null));

// Associates
// https://sequelize.readthedocs.io/en/v3/docs/associations/

// db.Comment.belongsTo(db.User, { foreignKey: 'user_id', as: 'author' });
// db.Comment.belongsTo(db.Poem, { foreignKey: 'commentable_id', as: 'poem' });

// db.Poem.hasMany(db.Comment, {
//     foreignKey: 'commentable_id',
//     as: 'comments',
//     onDelete: 'CASCADE',
//     scope: { commentable: 'poem' }
// });

// db.Poem.belongsTo(db.User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE' });

// db.Poem.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
// db.User.hasMany(db.Poem, { as: 'poem' });

// db.Comment.belongsToMany(db.Poem, { foreignKey: 'commentable_id', as: 'object' });
// db.Poem.hasMany(db.Comment, { as: 'comments', foreignKey: 'id', targetKey: 'commentable_id' });

// db.Poem.hasMany(db.Comment, {
//     foreignKey: 'commentable_id',
//     constraints: false,
//     scope: {
//         commentable: 'poem'
//     },
//     as: 'comment'
// });

// db.Comment.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });

// db.Comment.belongsTo(db.Poem, {
//     foreignKey: 'commentable_id',
//     // constraints: false,
//     as: 'poem'
// });

// Synchronizing any model changes with database.
sequelize
    .sync()
    .then(() => {
        console.log('Database synchronized'); // eslint-disable-line no-console
    })
    .catch(error => {
        if (error) console.log('An error occured %j', error); // eslint-disable-line no-console
    });

// assign the sequelize variables to the db object and returning the db.
module.exports = _.extend(
    {
        sequelize,
        Sequelize
    },
    db
);
