import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as route from "./routes/routes";
import {handleError} from "./util/error";

class App {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.database();
        this.config();
        this.routes();
        this.errors();
    }

    // Setup database connection
    private database(): void {
        mongoose.connect('mongodb://localhost/ExampleDB', { useNewUrlParser: true });
    }

    // Middleware
    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
    }

    // Bind routes
    private routes(): void {
        route.routes(this.app);
    }

    //error handling
    private errors(): void {
        this.app.use(handleError);
    }

}

// Export app to import in server.ts
export default new App().app;
