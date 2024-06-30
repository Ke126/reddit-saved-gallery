import { bootstrap } from './app.js';

const PORT = Number.parseInt(process.env.REDDIT_PORT || '');

bootstrap(PORT).then(server => {
    process.on('SIGTERM', () => {
        server.close(() => {
            process.exit(0);
        });
    });
});