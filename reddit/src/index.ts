import { bootstrap } from './app.js';
import 'dotenv/config'

const PORT = Number.parseInt(process.env.PORT || '');

bootstrap(PORT).then(server => {
    process.on('SIGTERM', () => {
        server.close(() => {
            process.exit(0);
        });
    });
});