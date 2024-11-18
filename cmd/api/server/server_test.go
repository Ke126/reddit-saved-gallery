package server_test

import (
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Ke126/reddit-saved-gallery/cmd/api/server"
	"github.com/Ke126/reddit-saved-gallery/internal/middleware"
)

func TestServer(t *testing.T) {
	// set up the server
	logger := slog.Default()
	mw := middleware.NewMiddleware(logger)

	const (
		REDDIT_STATUS           = http.StatusOK      // 200
		QUERY_STATUS            = http.StatusCreated // 201
		REDDIT_BODY             = "hello from reddit\n"
		QUERY_BODY              = "hello from query\n"
		NOT_FOUND_BODY          = "404 page not found\n"
		METHOD_NOT_ALLOWED_BODY = "Method Not Allowed\n"
		AUTHORIZATION           = "bearer hello12345"
	)

	redditHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(REDDIT_STATUS)
		w.Write([]byte(REDDIT_BODY))
	})

	queryHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(QUERY_STATUS)
		w.Write([]byte(QUERY_BODY))
	})

	server := server.NewServer(mw, redditHandler, queryHandler)

	// table tests to check correct routing
	tests := []struct {
		method     string
		path       string
		wantStatus int
		wantBody   string
	}{
		{http.MethodGet, "/posts", QUERY_STATUS, QUERY_BODY},
		{http.MethodGet, "/posts?something=12345", QUERY_STATUS, QUERY_BODY},

		{http.MethodPost, "/posts", REDDIT_STATUS, REDDIT_BODY},

		{http.MethodPut, "/posts", http.StatusMethodNotAllowed, METHOD_NOT_ALLOWED_BODY}, // not allowed
		{http.MethodPut, "/posts/", http.StatusNotFound, NOT_FOUND_BODY},                 // not found
		{http.MethodPut, "/posts/id123", QUERY_STATUS, ""},                               // ok (empty body)
		{http.MethodPut, "/posts/id123/", http.StatusNotFound, NOT_FOUND_BODY},           // not found
		{http.MethodPut, "/posts/id123/something", http.StatusNotFound, NOT_FOUND_BODY},  // not found

		{http.MethodPatch, "/posts/id123", QUERY_STATUS, QUERY_BODY},

		{http.MethodDelete, "/posts/id123", QUERY_STATUS, ""},

		{http.MethodGet, "/", http.StatusNotFound, NOT_FOUND_BODY},
		{http.MethodPost, "/", http.StatusNotFound, NOT_FOUND_BODY},
		{http.MethodPut, "/something", http.StatusNotFound, NOT_FOUND_BODY},
	}

	for _, tt := range tests {
		t.Run(tt.method+" "+tt.path, func(t *testing.T) {
			// without authorization
			req := httptest.NewRequest(tt.method, tt.path, nil)
			res := httptest.NewRecorder()
			server.ServeHTTP(res, req)

			gotStatus := res.Result().StatusCode

			if gotStatus != http.StatusUnauthorized {
				t.Errorf("got %d, want %d", gotStatus, http.StatusUnauthorized)
			}

			// with authorization
			req = httptest.NewRequest(tt.method, tt.path, nil)
			req.Header.Set("Authorization", AUTHORIZATION)
			res = httptest.NewRecorder()
			server.ServeHTTP(res, req)

			gotStatus = res.Result().StatusCode
			gotBody, _ := io.ReadAll(res.Result().Body)

			if gotStatus != tt.wantStatus {
				t.Errorf("got %d, want %d", gotStatus, tt.wantStatus)
			}
			if string(gotBody) != tt.wantBody {
				t.Errorf("got %s, want %s", gotBody, tt.wantBody)
			}
		})
	}
}
