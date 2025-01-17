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

            title: {
                type: DataTypes.STRING
            },

            content: {
                type: DataTypes.TEXT,
                allowNull: false
            },

            dedicate_to: {
                type: DataTypes.JSONB
            },

            access_level: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },

            likes_count: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },

            comments_count: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },

            views_count: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },

            daily_id: {
                type: DataTypes.INTEGER
            },

            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
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
            foreignKey: 'poem_id',
            as: 'comments'
        });

        Poem.hasMany(models.Like, {
            foreignKey: 'poem_id',
            as: 'likes'
        });

        Poem.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };

    sequelizePaginate.paginate(Poem);

    return Poem;
};
