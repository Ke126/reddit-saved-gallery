package service

type posts = []any

type redditPostsBody struct {
	Data struct {
		After    string `json:"after"`
		Dist     int    `json:"dist"`
		Children posts  `json:"children"`
	} `json:"data"`
}

type parsedPosts struct {
	Timestamp int64  `json:"timestamp"`
	Posts     *posts `json:"posts"`
}
