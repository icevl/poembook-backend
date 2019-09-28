/**
 * Users subscriptions
 */
module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define('Subscription', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        subscriber_id: {
            type: DataTypes.INTEGER
        },

        user_id: {
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

    return Subscription;
};
