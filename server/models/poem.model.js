import sequelizePaginate from 'sequelize-paginate';

module.exports = (sequelize, DataTypes) => {
    const Poem = sequelize.define('Poem', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        UserId: {
            type: DataTypes.INTEGER,
            field: 'user_id'
        },

        // user_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        //     // references: {
        //     //     model: 'User',
        //     //     key: 'id'
        //     // }
        // },

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
    });

    sequelizePaginate.paginate(Poem);

    return Poem;
};
