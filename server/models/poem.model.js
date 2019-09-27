import sequelizePaginate from 'sequelize-paginate';

module.exports = (sequelize, DataTypes) => {
    const Poem = sequelize.define(
        'Poem',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
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

            comments_count: {
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

    Poem.associate = models => {
        Poem.hasMany(models.Comment, {
            foreignKey: 'commentable_id',
            as: 'comments',
            onDelete: 'CASCADE',
            scope: { commentable: 'poem' }
        });
        Poem.belongsTo(models.User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE' });
    };

    sequelizePaginate.paginate(Poem);

    return Poem;
};
