import app from "./app";
import {setupWebSockets} from './socket';

const port = 4000;

// Start server on cloud port or local port 3000
export const server = app.listen(process.env.PORT || port, function() {
    console.log('Express server listening on port ' + port);
});

setupWebSockets(server);