import { bootstrap } from './app.js';

const PORT = Number.parseInt(process.env.API_PORT || '4000');

bootstrap(PORT).then((server) => {
    process.on('SIGTERM', () => {
        server.close(() => {
            process.exit(0);
        });
    });
});
