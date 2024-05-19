// place files you want to import through the `$lib` alias in this folder.
export interface GetPostsResponseBody {
	count: number;
	total_count: number;
	page: number;
	posts: RedditThing[];
}

export interface GetSubredditsResponseBody {
	subreddits: SubredditIn[];
}

interface BaseData {
	created: number;
	author: string;
	score: number;
	subreddit: string;
}

interface Comment extends BaseData {
	body: string;
	link_author: string;
	link_title: string;

	// optional
	media_metadata?: {
		[media_id: string]: {
			s: {
				u: string;
			};
		};
	};
}

interface Link extends BaseData {
	domain: string;
	num_comments: number;
	permalink: string;
	selftext: string;
	thumbnail: string;
	title: string;
	url: string;

	// optional
	preview?: {
		images: {
			source: {
				url: string;
			};
		}[];
	};
	media_metadata?: {
		[media_id: string]: {
			s: {
				u: string;
			};
		};
	};
	gallery_data?: {
		items: {
			media_id: string;
		}[];
	};
}

interface BaseThing {
	kind: 't1' | 't3';
	_id: string;
	pinned: boolean;
}

interface CommentThing extends BaseThing {
	kind: 't1';
	data: Comment;
}

interface LinkThing extends BaseThing {
	kind: 't3';
	data: Link;
}

export type RedditThing = CommentThing | LinkThing;

export interface RedditPost {
	_id: string;
	pinned: boolean;
	subreddit: string;
	media_url: string | undefined;
	title: string;
	selftext: string;
	permalink: string;
	author: string;
	link_author: string | undefined;
	num_comments: number;
	score: number;
	created: number;
}

export interface SubredditIn {
	subreddit: string;
	count: number;
}

export interface Subreddit {
	subreddit: string;
	checked: boolean;
	count: number;
}

export interface IUser {
	username: string;
	icon_img: string;
	access_token: string;
	refresh_token: string;
	exp: number;
}
