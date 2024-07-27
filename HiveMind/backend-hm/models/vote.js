import { DataTypes } from "sequelize";

export function createModel(database) {
    database.define('Vote', {
        title: {
            type: DataTypes.TEXT
        },
        username: {
            type: DataTypes.TEXT,
            allowNull : false
        },
    });
}