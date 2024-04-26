import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

let subreddits: { subreddit: string, count: number, checked: boolean }[] = [];
let next = 0;

export const load: LayoutServerLoad = ({ locals }) => {
    console.log("/ layout load");
    if (!locals.user) {
        console.log("Not authenticated");
        redirect(301, '/login');
    };
    ++next;
    const subreddit = {
        subreddit: `sub${next}`,
        count: next,
        checked: true
    }
    subreddits.push(subreddit);
    return {
        subreddits: subreddits
    }
    // fetch subreddits
}