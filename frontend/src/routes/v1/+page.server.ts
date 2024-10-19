import type { GetPostsResponseBody } from '$lib/types/response';
import { formatter } from '$lib/server/formatter';
import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { revokeTokens } from '$lib/server/auth';
import { secrets } from '$lib/server/secrets';

export const load: PageServerLoad = async ({ locals, url }) => {
    console.log('LOAD /v1 (page)');
    if (!locals.user) {
        console.log('Not authenticated');
        redirect(301, '/login');
    }
    console.log(`GET ${url}`);
    const fetchUrl = new URL(`${secrets.API_SERVER}/posts`);
    url.searchParams.forEach((value: string, key: string) => {
        fetchUrl.searchParams.append(key, value);
    });
    const response = await fetch(fetchUrl, {
        headers: {
            authorization: `bearer ${locals.user.access_token}`
        }
    });
    const result = (await response.json()) as GetPostsResponseBody;
    return {
        posts: {
            total_count: result.total_count,
            count: result.count,
            page: result.page,
            posts: result.posts.map(formatter)
        }
    };
};

// actions are reused from /(app)