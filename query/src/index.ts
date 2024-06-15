import { bootstrap } from './app.js';
import 'dotenv/config'

const PORT = Number.parseInt(process.env.QUERY_PORT || '');

bootstrap(PORT).then(server => {
    process.on('SIGTERM', () => {
        server.close(() => {
            process.exit(0);
        });
    });
});