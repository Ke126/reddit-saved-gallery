import type { ILogger } from "./logger.models.js";

export async function fetcher(logger: ILogger, request: Request) {
    const response = await fetch(request.clone());
    if (!response.ok) {
        logger.warn(`Bad response code ${response.status}`);
        throw new Error("Bad response code");
    }
    logger.info(`Successful fetch with status code ${response.status}`);
    return response;
}