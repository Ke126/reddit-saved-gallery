import type { ILogger } from "./loggerModel.js";

export function makeHttpService(logger: ILogger) {
    return {
        async fetch(request: Request) {
            const response = await fetch(request.clone());
            if (!response.ok) {
                throw new Error(`Bad response code ${response.status} from fetch`);
            }
            logger.info(`Successful fetch with status code ${response.status}`);
            return response;
        }
    }
}