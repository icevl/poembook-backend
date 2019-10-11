module.exports = (sequelize, DataTypes) => {
    const DailyPoem = sequelize.define(
        'DailyPoem',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            lang: {
                type: DataTypes.STRING,
                allowNull: false
            },

            title: {
                type: DataTypes.STRING
            },

            count: {
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

    return DailyPoem;
};
