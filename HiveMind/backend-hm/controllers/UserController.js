import { User } from "../models/database.js";
import { Comments } from "../models/database.js";
import { Vote } from "../models/database.js";
import { Ideas } from "../models/database.js";
import Jwt from "jsonwebtoken";
import crypto from "crypto";
import { error } from "console";
import { title } from "process";
import CircularJSON from "circular-json";
import {parse,stringify} from "flatted";
import { type } from "os";

export class UserController{
  
    /*Funzione che controlla username e password per il login*/

    static async checkCredentials(req,res) {
        let found = await User.findOne({
            where: {
                username: req.body.usr,
                password: req.body.pwd
            }
        });

        return found !== null;
    }
      
    static async authentication(req,res) {
        let isAuth = await UserController.checkCredentials(req,res);
        if(isAuth) {
            res.json(UserController.issueToken(req.body.usr));
        } else {
            res.status(401);
            res.json( {error: "Credenziali non valide"});
        }
    }
    
    static issueToken(username){
        return Jwt.sign({user:username}, process.env.TOKEN_SECRET, {expiresIn: `${60*60}s`});
      }

    static isTokenValid(token, callback){
        Jwt.verify(token, process.env.TOKEN_SECRET, callback);
      }

    /**Salva un account nel database */
    static async registerUser(req) {

        
        let user = new User({
            username : req.body.usr,
            password : req.body.pwd
        });

        try{
            return user.save();
        }catch(err){
            
        }

    }

    static async writeComment(req, res) {
        
            let comment = new Comments({
                username: req.body.username,
                text: req.body.text,
                titleIdea: req.body.titleIdea
            });
    
            // Salva il commento e restituisci l'oggetto salvato
            let savedComment = await comment.save();
            
            res.json(savedComment);
            
    }

    static async getComments(req) {
        return Comments.findAll({
            where: {
                titleIdea : req.params.titleIdea
            }
        });
    }

    static async countComments(req) {
        return await Comments.count({
            where : {
                titleIdea : req.params.titleIdea
            }
        })
    }

    static async setUpVoteSpecial(req,res) {
        const commentId = req.params.id;
        console.log(commentId);
        try{
            const comment = await Comments.findByPk(commentId);

            if(comment) {
                comment.upVoteSpecial = true;
                await comment.save();

                res.status(200).json({message: "Commento aggiornato con successo!", comment});
            }else {
                res.status(404).json({error: "Commento non trovato"});
            }
        }catch(error) {
            console.error("Errore nell aggiornameto del commento");
        }
    }

    /**tiene traccia di chi ha votato quell'idea */
    static async updateVote(req,res) {
        const username = req.params.username;
        const titleIdea = req.params.titleIdea;
        try{
            let vote = new Vote({
                title: titleIdea,
                username : username
            })
           
           return await vote.save();
            
        }catch(error){
            console.error("Errore nell'aggiornamento del voto!",error);
        }
    } 

    /**Aggiunge l'up all'idea */
    static async setVote(req,res) {

        const vote = req.params.vote;
        const titleIdea = req.params.titleIdea;

        try{
            let idea = await Ideas.findByPk(titleIdea);
            
            console.log(vote);
            if(vote == 1){
                console.log("sono in upvote");
                idea.upVote += 1;
            }else if(vote == 0) { 
                console.log("sono in downvote");
                idea.downVote+= 1;
            }

            await idea.save();
        }catch(error){
            console.error("errore nell'inserimento del voto in idea");
        }
    }

    static async getVotes(req,res) {

        const titleIdea = req.params.titleIdea.trim();
        const username = req.params.username.trim();

    
        
        let found=  await Vote.findOne({
            where: {
                username: username,
                title: titleIdea
            }
        });

        console.log(found);

        return found !== null;
        
    }


    static async voti(req,res) {
        return Vote.findAll();
    }

    /*static async canUserModify(username){
        const user = await User.findByPk(username);
        //todo must exist and be associated with user
        return user
      }
*/

}