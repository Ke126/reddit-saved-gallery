package handler_test

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Ke126/reddit-saved-gallery/cmd/reddit/handler"
	"github.com/Ke126/reddit-saved-gallery/internal/status"
)

func TestHandlePullPosts(t *testing.T) {
	redditService := newMockRedditService(nil)
	redditHandler := handler.NewRedditHandler(redditService)

	t.Run("returns Unauthorized when request jwt fails to parse", func(t *testing.T) {
		req := httptest.NewRequest("POST", "/posts", nil)
		req.Header.Set("Authorization", "bearer 123456789")
		res := httptest.NewRecorder()

		redditHandler.HandlePullPosts(res, req)

		got := res.Result().StatusCode
		want := http.StatusUnauthorized

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})

	t.Run("returns Bad Request when request jwt is ok but body is missing", func(t *testing.T) {
		token := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhaWQiOiJnb3VsYXNoIn0.3seiv0iz2-bug-TZK_DrbPBZ3SwxDyvSsxUsEUJJSN0"

		req := httptest.NewRequest("POST", "/posts", nil)
		req.Header.Set("Authorization", "bearer "+token)
		res := httptest.NewRecorder()

		redditHandler.HandlePullPosts(res, req)

		got := res.Result().StatusCode
		want := http.StatusBadRequest

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})

	t.Run("returns Accepted when request jwt and body are ok, and service does not return error", func(t *testing.T) {
		token := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhaWQiOiJnb3VsYXNoIn0.3seiv0iz2-bug-TZK_DrbPBZ3SwxDyvSsxUsEUJJSN0"

		req := httptest.NewRequest("POST", "/posts", strings.NewReader(`{"username":"bob"}`))
		req.Header.Set("Authorization", "bearer "+token)
		res := httptest.NewRecorder()

		redditHandler.HandlePullPosts(res, req)

		got := res.Result().StatusCode
		want := http.StatusAccepted

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}

		gotToken := redditService.SpiedToken
		wantToken := token

		if gotToken != wantToken {
			t.Errorf("got %s, want %s", gotToken, wantToken)
		}

		gotUsername := redditService.SpiedUsername
		wantUsername := "bob"

		if gotUsername != wantUsername {
			t.Errorf("got %s, want %s", gotUsername, wantUsername)
		}
	})

	redditService = newMockRedditService(errors.New("some error"))
	redditHandler = handler.NewRedditHandler(redditService)

	t.Run("returns Internal Server Error when request jwt and body are ok, and service returns arbitrary error", func(t *testing.T) {
		req := httptest.NewRequest("POST", "/posts", strings.NewReader(`{"username":"bob"}`))
		req.Header.Set("Authorization", "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhaWQiOiJnb3VsYXNoIn0.3seiv0iz2-bug-TZK_DrbPBZ3SwxDyvSsxUsEUJJSN0")
		res := httptest.NewRecorder()

		redditHandler.HandlePullPosts(res, req)

		got := res.Result().StatusCode
		want := http.StatusInternalServerError

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})

	redditService = newMockRedditService(&status.FetchStatusErr{StatusCode: http.StatusTeapot})
	redditHandler = handler.NewRedditHandler(redditService)

	t.Run("returns correct status when request jwt and body are ok, and service returns fetch error", func(t *testing.T) {
		req := httptest.NewRequest("POST", "/posts", strings.NewReader(`{"username":"bob"}`))
		req.Header.Set("Authorization", "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhaWQiOiJnb3VsYXNoIn0.3seiv0iz2-bug-TZK_DrbPBZ3SwxDyvSsxUsEUJJSN0")
		res := httptest.NewRecorder()

		redditHandler.HandlePullPosts(res, req)

		got := res.Result().StatusCode
		want := http.StatusTeapot

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})
}

func TestHandleSavePosts(t *testing.T) {
	redditService := newMockRedditService(nil)
	redditHandler := handler.NewRedditHandler(redditService)

	// Necessary so that mux can match the id path
	mux := http.NewServeMux()
	mux.HandleFunc("PUT /posts/{id}", redditHandler.HandleSavePost)

	t.Run("mux returns Not Found when post id is empty", func(t *testing.T) {
		req := httptest.NewRequest("PUT", "/posts/", nil)
		req.Header.Set("Authorization", "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhaWQiOiJnb3VsYXNoIn0.3seiv0iz2-bug-TZK_DrbPBZ3SwxDyvSsxUsEUJJSN0")
		res := httptest.NewRecorder()

		mux.ServeHTTP(res, req)

		got := res.Result().StatusCode
		want := http.StatusNotFound

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})

	t.Run("returns Accepted when request jwt and post id are ok, and service does not return error", func(t *testing.T) {
		token := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhaWQiOiJnb3VsYXNoIn0.3seiv0iz2-bug-TZK_DrbPBZ3SwxDyvSsxUsEUJJSN0"
		req := httptest.NewRequest("PUT", "/posts/post12345", nil)
		req.Header.Set("Authorization", "bearer "+token)
		res := httptest.NewRecorder()

		mux.ServeHTTP(res, req)

		got := res.Result().StatusCode
		want := http.StatusAccepted

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}

		gotToken := redditService.SpiedToken
		wantToken := token

		if gotToken != wantToken {
			t.Errorf("got %s, want %s", gotToken, wantToken)
		}

		gotId := redditService.SpiedId
		wantId := "post12345"

		if gotId != wantId {
			t.Errorf("got %s, want %s", gotId, wantId)
		}
	})
}

type mockRedditService struct {
	out           error
	SpiedToken    string
	SpiedUsername string
	SpiedId       string
}

func newMockRedditService(out error) *mockRedditService {
	return &mockRedditService{out, "", "", ""}
}

func (m *mockRedditService) PullPosts(accessToken string, username string) error {
	m.SpiedToken = accessToken
	m.SpiedUsername = username
	return m.out
}

func (m *mockRedditService) SavePost(accessToken string, id string) error {
	m.SpiedToken = accessToken
	m.SpiedId = id
	return m.out
}

func (m *mockRedditService) UnsavePost(accessToken string, id string) error {
	m.SpiedToken = accessToken
	m.SpiedId = id
	return m.out
}
