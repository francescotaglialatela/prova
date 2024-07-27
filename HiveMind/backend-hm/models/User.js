import { DataTypes } from "sequelize";

export function createModel(database) {
    database.define('User', {
        username: {
            type: DataTypes.TEXT,
            allowNull: false,
            primaryKey: true
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    })
}