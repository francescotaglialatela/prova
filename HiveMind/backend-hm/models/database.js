import { Sequelize } from "sequelize";
import { createModel as createUserModel } from "./User.js";
import{ createModel as createIdeasModel } from "./Idea.js";
import {createModel as createCommentModel} from "./comment.js"
import {createModel as createVoteModel} from "./vote.js"

import 'dotenv/config.js'

export const database = new Sequelize(process.env.DB_CONNECTION_URI,{
    dialect: process.env.DIALECT
})

createUserModel(database);
createIdeasModel(database);
createCommentModel(database);
createVoteModel(database);

export const {User, Ideas, Comments, Vote} = database.models;

//synchronize schema (creates missing tables)
database.sync().then( () => {
  
    console.log("Database synced correctly");
  }).catch( err => {
    console.err("Error with database synchronization: " + err.message);
  });