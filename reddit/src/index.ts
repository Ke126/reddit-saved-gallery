import { app } from './app.js';
import makeLogger from './shared/logger.js'
import 'dotenv/config'

const logger = makeLogger("Reddit Service");
const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`);
});

process.on('SIGTERM', () => {
    server.close(() => {
        logger.info('Closing server gracefully');
        process.exit(0);
    });
});