package service_test

import (
	"errors"
	"io"
	"log/slog"
	"net/http"
	"os"
	"strings"
	"testing"

	"github.com/Ke126/reddit-saved-gallery/cmd/reddit/service"
	"github.com/Ke126/reddit-saved-gallery/internal/status"
)

func TestPullPosts(t *testing.T) {
	page, _ := os.ReadFile("./testdata.json")
	lastPage := `{"data":{"after":null,"dist":10,"children":[1,2,3,4,5,6,7,8,9,10]}}`
	client := NewMockPagingClient(5, string(page), lastPage)
	redditService := service.NewRedditService(slog.Default(), client, "something.com")

	t.Run("pages correctly", func(t *testing.T) {
		redditService.PullPosts("bearer 1234567890", "user123")

		got := client.redditCalls
		want := client.maxCount

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}

		got = client.queryCalls

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}

	})
}

func TestSavePost(t *testing.T) {
	client := NewOkMockClient()
	redditService := service.NewRedditService(slog.Default(), client, "hello")

	t.Run("returns nil when client call succeeds", func(t *testing.T) {
		err := redditService.SavePost("bearer 1234567890", "post123")

		if err != nil {
			t.Errorf("got err %s", err)
		}
	})
}

func TestUnsavePost(t *testing.T) {
	client := NewErrorMockClient()
	redditService := service.NewRedditService(slog.Default(), client, "hello")

	t.Run("returns FetchStatusErr when client call fails", func(t *testing.T) {
		err := redditService.SavePost("bearer hello12345", "123456")

		if err == nil {
			t.Errorf("did not get err")
		}

		var err2 *status.FetchStatusErr
		if !errors.As(err, &err2) {
			t.Errorf("did not get FetchStatusErr")
		}

		got := err2.StatusCode
		want := http.StatusBadRequest
		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})
}

type mockStatusClient struct {
	status int
}

func NewOkMockClient() *mockStatusClient {
	return &mockStatusClient{http.StatusOK}
}

func NewErrorMockClient() *mockStatusClient {
	return &mockStatusClient{http.StatusBadRequest}
}

func (c *mockStatusClient) Do(req *http.Request) (*http.Response, error) {
	return &http.Response{
		Body:       io.NopCloser(strings.NewReader("")),
		StatusCode: c.status}, nil
}

type mockPagingClient struct {
	redditCalls int
	queryCalls  int
	maxCount    int
	page        string
	lastPage    string
}

func NewMockPagingClient(maxCount int, page string, lastPage string) *mockPagingClient {
	return &mockPagingClient{0, 0, maxCount, page, lastPage}
}

func (c *mockPagingClient) Do(req *http.Request) (*http.Response, error) {
	// non reddit requests should return OK with no body
	if req.URL.Host != "oauth.reddit.com" {
		c.queryCalls += 1
		return &http.Response{
			Body:       io.NopCloser(strings.NewReader("")),
			StatusCode: http.StatusOK}, nil
	}

	c.redditCalls += 1
	// requests exceeding the page limit should return the last page
	if c.redditCalls >= c.maxCount {
		return &http.Response{
			Body:       io.NopCloser(strings.NewReader(c.lastPage)),
			StatusCode: http.StatusOK}, nil
	}

	// other requests should return a standard page
	return &http.Response{
		Body:       io.NopCloser(strings.NewReader(c.page)),
		StatusCode: http.StatusOK}, nil
}
