package service

import (
	"bytes"
	"encoding/json"
	"log/slog"
	"net/http"
	"strconv"
	"time"

	"github.com/Ke126/reddit-saved-gallery/internal/status"
)

// https://oauth.reddit.com/user/${username}/saved?limit=100&raw_json=1
// https://oauth.reddit.com/api/save?id=${postId}
// https://oauth.reddit.com/api/unsave?id=${postId}
const REDDIT_API = "https://oauth.reddit.com"
const MAX_ITER = 10

type redditService struct {
	logger   *slog.Logger
	client   httpClient
	queryUrl string
}

type httpClient interface {
	Do(req *http.Request) (*http.Response, error)
}

func NewRedditService(logger *slog.Logger, client httpClient, url string) *redditService {
	return &redditService{logger, client, url}
}

func (rs *redditService) PullPosts(accessToken string, username string) error {
	iter := 1
	after := ""
	// backward compatability with JavaScript's Date.now()
	timestamp := time.Now().UnixMilli()
	for iter == 1 || (after != "" && iter <= MAX_ITER) {
		posts, err := rs.importFromReddit(accessToken, username, after)

		if err != nil {
			return err
		}

		rs.logger.Info("Pulled " + strconv.Itoa(posts.Data.Dist) + " posts after=" + after + " from Reddit")

		err = rs.sendToQuery(accessToken, posts, timestamp)

		if err != nil {
			return err
		}

		rs.logger.Info("Sent " + strconv.Itoa(posts.Data.Dist) + " posts after=" + after + " to Query")

		after = posts.Data.After
		timestamp -= int64(posts.Data.Dist)
		iter += 1
	}
	return nil
}

func (rs *redditService) importFromReddit(accessToken string, username string, after string) (*redditPostsBody, error) {
	endpoint := REDDIT_API + "/user/" + username + "/saved?limit=100&raw_json=1"
	req, err := http.NewRequest(http.MethodGet, endpoint+"&after="+after, nil)

	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "bearer "+accessToken)
	res, err := rs.client.Do(req)

	if err != nil {
		return nil, err
	}

	defer res.Body.Close()

	if !status.Ok(res.StatusCode) {
		// status code error
		return nil, &status.FetchStatusErr{StatusCode: res.StatusCode}
	}

	var out redditPostsBody
	err = json.NewDecoder(res.Body).Decode(&out)

	if err != nil {
		return nil, err
	}

	return &out, nil
}

func (rs *redditService) sendToQuery(accessToken string, posts *redditPostsBody, timestamp int64) error {
	out := &parsedPosts{Timestamp: timestamp, Posts: &posts.Data.Children}
	var buf bytes.Buffer
	err := json.NewEncoder(&buf).Encode(out)

	if err != nil {
		return err
	}

	endpoint := rs.queryUrl + "/posts"
	req, err := http.NewRequest(http.MethodPost, endpoint, &buf)

	if err != nil {
		return err
	}

	req.Header.Set("Authorization", "bearer "+accessToken)
	req.Header.Set("Content-Type", "application/json")
	res, err := rs.client.Do(req)

	if err != nil {
		return err
	}

	defer res.Body.Close()

	if !status.Ok(res.StatusCode) {
		// status code error
		return &status.FetchStatusErr{StatusCode: res.StatusCode}
	}

	return nil
}

func (rs *redditService) SavePost(accessToken string, postId string) error {
	return rs.doSave(accessToken, postId, true)
}

func (rs *redditService) UnsavePost(accessToken string, postId string) error {
	return rs.doSave(accessToken, postId, false)
}

func (rs *redditService) doSave(accessToken string, postId string, save bool) error {
	endpoint := REDDIT_API + "/api/save?id=" + postId
	if !save {
		endpoint = REDDIT_API + "/api/unsave?id=" + postId
	}
	req, err := http.NewRequest(http.MethodPost, endpoint, nil)
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "bearer "+accessToken)
	res, err := rs.client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	if !status.Ok(res.StatusCode) {
		// status code error
		return &status.FetchStatusErr{StatusCode: res.StatusCode}
	}
	msg := "Saved post " + postId
	if !save {
		msg = "Unsaved post " + postId
	}
	rs.logger.Info(msg)
	return nil
}
