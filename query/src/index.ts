import { bootstrap } from './app.js';

const PORT = Number.parseInt(process.env.QUERY_PORT || '4001');

bootstrap(PORT).then((server) => {
    process.on('SIGTERM', () => {
        server.close(() => {
            process.exit(0);
        });
    });
});
