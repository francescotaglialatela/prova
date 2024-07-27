import express from "express";
import { IdeaController } from "../controllers/IdeaController.js";

export const ideaRouter = new express.Router();

    ideaRouter.post("/saveIdea",(req,res,next) => {
        IdeaController.saveIdea(req).then( Ideas => {
            res.json(Ideas);
        }).catch(err => {
            console.log("Errore nella richiesta");
            next(err);
        });
    });

     /**Funzione che carica le idee 10 per volta */
    ideaRouter.get("/getIdeas",(req,res,next) => {
        IdeaController.getAllIdeas().then( result => {
            res.json(result);
        }).catch(err => {
            next(err);
        });
    });

    /**Funzione che carica altre idee controversial*/
    ideaRouter.get("/getMoreIdeas/:offset", (req,res,next) => {
        IdeaController.getMoreIdeas(req,res).then( result => {
            res.json(result);
        }).catch(err => {
            next(err);
        })
    })

    /**Funzione che carica le  10 idee Unpopular */
    ideaRouter.get("/getUnpopularIdeas",(req,res,next) => {
    IdeaController.getUnpopularIdea().then( result => {
        res.json(result);
    }).catch(err => {
        next(err);
    })
})

    ideaRouter.get('/getMoreUnpopular/:offset', (req,res,next) => {
        IdeaController.getMoreUnpopular(req,res).then( result => {
            res.json(result);
        }).catch(err => {
            next(err);
        })
    })

/**Funzione che caraica le 10 idee Mainstream */
    ideaRouter.get("/getMainstreamIdeas", (req,res,next) => {
        IdeaController.getMainstreamIdea().then( result => {
            res.json(result);
        }).catch( err => {
            next(err);
        })
    })

    ideaRouter.get("/getMoreMainstream/:offset", (req,res,next) => {
        IdeaController.getMoreMainstream(req,res).then(result => {
            res.json(result);
        }).catch(err => {
            next(err);
        })
    })

    ideaRouter.get('/countIdeas', (req,res,next) => {
        IdeaController.countIdeas(req).then(result => {
            res.json(result);
        }).catch(err => {
            next(err);
        });
    })


    ideaRouter.get('/topIdea', (req,res,next) => {
        IdeaController.findTopIdeaOfDay(req,res).then(result => {
            res.json(result);
        }).catch(err => {
            next(err);
        })
    })
   

    ideaRouter.put('/manualUpVote/:titleIdea/:vote', (req,res,next) => {
        IdeaController.manualUpVote(req,res).then( result => {
            res.json(result);
        }).catch(err => {
            next(err);
        })
    })

    ideaRouter.put('/manualdownVote/:titleIdea/:vote', (req,res,next) => {
        IdeaController.manualDownVote(req,res).then( result => {
            res.json(result);
        }).catch(err => {
            next(err);
        })
    })
    