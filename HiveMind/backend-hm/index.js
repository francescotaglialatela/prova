import express from 'express';
import morgan from 'morgan';
import cors from "cors";

import { ideaRouter } from './routes/IdeaRouter.js';
import { router } from './routes/UserRouter.js';

const app= express();
const PORT = 3000;

// Register the morgan logging middleware, use the 'dev' format
app.use(morgan('dev'));

app.use(cors()); //API will be accessible from anywhere. We'll talk about this in Lecture 23!

// Parse incoming requests with a JSON payload
app.use(express.json());

//error handler
app.use( (err, req, res, next) => {
    console.log(err.stack);
    res.status(err.status || 500).json({
      code: err.status || 500,
      description: err.message || "An error occurred"
    });
  });


app.use(ideaRouter);
app.use(router);

app.listen(PORT, () => {
    console.log("ASCOLTO SULLA PORTA 3000");
})