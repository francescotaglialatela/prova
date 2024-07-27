import { DataTypes } from "sequelize";

export function createModel(database) {
    database.define('Ideas', {
        title: {
            type: DataTypes.TEXT,
            primaryKey: true
        },
        text: {
            type: DataTypes.TEXT,
        },
        upVote: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        downVote : {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        data: {
            type: DataTypes.DATE, // Impostato come DATE per garantire la compatibilità tra diversi tipi di database
            defaultValue: DataTypes.NOW
        },
        username: {
            type: DataTypes.TEXT
        }
    });
}

