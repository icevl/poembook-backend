/**
 * Accounts Schema
 *
 */
module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define('Account', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        facebook_id: {
            type: DataTypes.STRING
        },

        users_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at'
        },

        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at'
        }
    });

    Account.associate = models => {
        Account.hasMany(models.User, {
            foreignKey: 'account_id',
            as: 'account',
            onDelete: 'CASCADE'
        });
    };

    return Account;
};
