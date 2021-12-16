import express, { Application, Request, Response } from "express";
import cors from 'cors';
import routes from './src/routes';


const app: Application = express();
const port = 8000;

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

routes.map(route => {
  app.use(`/api/${route.path}`, route.router);
})

try {
    app.listen(port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });
} catch (error ) {
    console.error(`Error occured`);
}