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

        name: {
            type: DataTypes.STRING
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        avatar: {
            type: DataTypes.STRING
        },

        avatar_meta: {
            type: DataTypes.VIRTUAL,
            get: function() {
                return `http://suka.ru/${this.getDataValue('avatar')}`;
            }
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
    };

    return User;
};
