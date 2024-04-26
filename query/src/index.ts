import { app } from './app.js';
import makeLogger from './shared/logger.js'
import 'dotenv/config'
import { initializeDatabase } from './utils/crud.js';

const logger = makeLogger("Query Service");
const PORT = process.env.PORT;

await initializeDatabase(logger)();

const server = app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`);
});

process.on('SIGTERM', () => {
    server.close(() => {
        logger.info('Closing server gracefully');
        process.exit(0);
    });
});