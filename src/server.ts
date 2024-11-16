import express, { Application } from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import apiRoute from './routes/api';
import { setupWebSocketServer } from './wsServer';

const app: Application = express();
// const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

setupWebSocketServer(server);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', apiRoute);

const createServer = (port: number) => {
    const server = http.createServer(app);
    setupWebSocketServer(server);

    server.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });

    return server;
};

// createServer(Number(PORT));

export { app, createServer };
