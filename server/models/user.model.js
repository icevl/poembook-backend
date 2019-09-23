/**
 * User Schema
 */
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at'
        },

        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at'
        },

        //timestamps: false
    });

    return User;
};
