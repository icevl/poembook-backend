import sequelizePaginate from 'sequelize-paginate';

module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define(
        'Comment',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            commentable: {
                type: DataTypes.STRING,
                allowNull: false
            },

            commentable_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'user_id'
            },

            content: {
                type: DataTypes.TEXT,
                allowNull: false
            },

            likes_count: {
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
        },
        {}
    );

    Comment.associate = models => {
        Comment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        Comment.belongsTo(models.Poem, { foreignKey: 'commentable_id', as: 'poem' });
    };

    sequelizePaginate.paginate(Comment);

    return Comment;
};
