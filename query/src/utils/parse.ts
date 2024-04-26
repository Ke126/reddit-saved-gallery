import { QueryRequest } from "../models/query.models.js";

export function parseJWT(jwt: string): string {
    const payload = jwt.split('.')[1];
    const json = JSON.parse(atob(payload));
    return json.aid;
}

export function parseQuery(query: qs.ParsedQs): QueryRequest {
    const q = typeof query.q === "string" ? query.q : "";
    const include = typeof query.include === "string" ? query.include.split(',') : undefined;
    const exclude = typeof query.exclude === "string" ? query.exclude.split(',') : undefined;
    const page = typeof query.page === "string" && Number.parseInt(query.page) ? Math.max(1, Number.parseInt(query.page)) : 1;

    // if (include && exclude) return { q, page };
    return { q, page, include, exclude }
}