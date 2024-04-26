// place files you want to import through the `$lib` alias in this folder.
export interface Post {
	_id: string;
	favorite: boolean;
	subreddit: string;
	has_image: boolean;
	image_link: string;
	title: string;
	selftext: string;
	permalink: string;
}

export interface Subreddit {
	subreddit: string;
	checked: boolean;
	count: number;
}

export interface IUser {
	username: string,
	icon_img: string,
	access_token: string,
	refresh_token: string,
	exp: number
}