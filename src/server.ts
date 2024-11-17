import express, { Application } from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import apiRoute from './routes/api';
import { setupWebSocketServer } from './wsServer';

const app: Application = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', apiRoute);

const createServer = (port?: number) => {
    const server = http.createServer(app);
    setupWebSocketServer(server);

    if (port) {
        server.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    }

    return server;
};

if (require.main === module) {
    createServer(Number(process.env.PORT) || 3000);
}

export { app, createServer };
