import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as route from './routes/routes';
import * as cors from 'cors';

class App {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.database();
        this.config();
        this.routes();
    }

    // Setup database connection
    private database(): void {
        mongoose.connect('mongodb+srv://TestUser:test@eoncluster-deeoa.gcp.mongodb.net/test?retryWrites=true&w=majority',
            {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});
    }

    // Middleware
    private config(): void {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
    }

    // Bind routes
    private routes(): void {
        route.routes(this.app);
    }

}

// Export app to import in server.ts
export default new App().app;
