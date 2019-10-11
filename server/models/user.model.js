/**
 * User Schema
 *
 */
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        login: {
            type: DataTypes.STRING,
            allowNull: false
        },

        name: {
            type: DataTypes.STRING
        },

        email: {
            type: DataTypes.STRING
        },

        password: {
            type: DataTypes.STRING
        },

        avatar: {
            type: DataTypes.STRING
        },

        avatar_url: {
            type: DataTypes.VIRTUAL,
            get: function() {
                return this.getDataValue('avatar');
                // return `http://suka.ru/${this.getDataValue('avatar')}`;
            }
        },

        poems_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        subscriptions_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        subscribers_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        account_id: {
            type: DataTypes.INTEGER
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

    User.associate = models => {
        User.hasMany(models.Comment, {
            foreignKey: 'user_id',
            as: 'comments',
            onDelete: 'CASCADE'
        });
        User.belongsTo(models.Account, { foreignKey: 'account_id', as: 'account' });
    };

    return User;
};
