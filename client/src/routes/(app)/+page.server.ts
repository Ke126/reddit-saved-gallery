import { CLIENT_ID, CLIENT_SECRET } from '$env/static/private';
import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = ({ locals, url }) => {
    console.log("/ page load");
    if (!locals.user) {
        console.log("Not authenticated");
        redirect(301, '/login');
    };
    const obj: Record<string, string> = {};
    url.searchParams.forEach((value: string, key: string) => {
        obj[key] = value;
    });
    // console.log(obj)
    return {
        posts: obj
    };
};

export const actions = {
    refresh: async ({ locals }) => {
        console.log("Form submit");
        await new Promise((fulfil) => setTimeout(fulfil, 2000));
        // await fetch('http://localhost:4000/newposts');
        console.log("Form done");
        console.log(locals.user);
        redirect(301, '/');
    },
    logout: async ({ locals, cookies }) => {
        const response = await fetch('https://www.reddit.com/api/v1/revoke_token', {
            method: 'POST',
            body: `token=${locals.user?.refresh_token}&token_type_hint=refresh_token`,
            headers: {
                Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        // const json = await response.json();
        console.log(response.status);
        cookies.delete('jwt', { path: '/' });
        redirect(301, '/login');
    }
} satisfies Actions;