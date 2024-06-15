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

	// not documented but seem to always exist
	num_comments: number;
	permalink: string;

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

export interface RedditCard {
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

export interface Subreddit extends SubredditIn {
	subreddit: string;
	count: number;
	checked: boolean;
}
