module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define(
        'Like',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            poem_id: {
                type: DataTypes.INTEGER
            },

            comment_id: {
                type: DataTypes.INTEGER
            },

            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'user_id'
            },

            user_login: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'user_login'
            },

            createdAt: {
                type: DataTypes.DATE,
                field: 'created_at'
            },

            updatedAt: {
                type: DataTypes.DATE,
                field: 'updated_at'
            }
        },
        {}
    );

    Like.associate = models => {
        Like.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        Like.belongsTo(models.Poem, { foreignKey: 'poem_id', as: 'poem', onDelete: 'cascade' });
        Like.belongsTo(models.Comment, { foreignKey: 'comment_id', as: 'comment' });
    };

    return Like;
};
