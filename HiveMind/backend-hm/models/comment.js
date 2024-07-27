import { DataTypes } from "sequelize";

export function createModel(database) {
    database.define('Comments',{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.TEXT
        },
        text : {
            type: DataTypes.TEXT
        },
        upVoteSpecial: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        titleIdea: {
            type: DataTypes.TEXT
        }
    })
}