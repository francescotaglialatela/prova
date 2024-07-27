import express from 'express';
import { UserController } from '../controllers/UserController.js';

export const router = new express.Router();

router.post('/log-in',(req,res, next) => {
    UserController.authentication(req,res).then(result => {
        res.json(result);
    }).catch(err => {
        next(err);
    });
});

/*Funzione che salva un account nel database*/
router.post('/register', (req,res,next) => {
    UserController.registerUser(req).then(result => {
        res.json(result);
    }).catch(err => {
        next(err);
    })
});

router.post('/comments', (req,res,next) => {
    UserController.writeComment(req,res).then(result => {
        res.json(result);
    }).catch(err => {
        next(err);
    })
});

router.get('/getComments/:titleIdea', (req,res,next) => {
    UserController.getComments(req).then(result => {
        res.json(result);
    }).catch(err => {
        next(err);
    });
})

router.get('/countComment/:titleIdea', (req,res,next) => {
    UserController.countComments(req).then(result => {
        res.json(result);
    }).catch(err => {
        next(err);
    });
})

router.put('/setUpComment/:id', (req,res,next) => {
    UserController.setUpVoteSpecial(req,res).then(result => {
        res.json(result);
    }).catch(err => {
        next(err);
    });
})

router.put('/updateVote/:titleIdea/:vote/:username', (req,res,next) => {
    UserController.updateVote(req,res).then(result => {
        res.json(result);
    }).catch(err => {
        next(err);
    })
})

router.put('/setVote/:titleIdea/:vote', (req,res,next) => {
    UserController.setVote(req,res).then(result => {
        res.json(result);
    }).catch(err => {
        next(err);
    })
});


router.get('/getVotes/:username/:titleIdea', (req,res,next) => {
    UserController.getVotes(req,res).then(result => {
        res.json(result);
    }).catch(err => {
        next(err);
    })
})

router.get('/voti', (req,res,next) => {
    UserController.voti(req,res).then(result => {
        res.json(result);
    }).catch(err => {
        next(err);
    })
})

