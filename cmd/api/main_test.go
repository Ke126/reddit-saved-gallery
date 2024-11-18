package main_test

import (
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Ke126/reddit-saved-gallery/cmd/api/handler"
	"github.com/Ke126/reddit-saved-gallery/cmd/api/server"
	"github.com/Ke126/reddit-saved-gallery/internal/middleware"
)

func TestIntegration(t *testing.T) {
	logger := slog.Default()
	mw := middleware.NewMiddleware(logger)

	// set up proxied servers
	redditServer := httptest.NewServer(http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		rw.WriteHeader(203)
		rw.Write([]byte("Hi from reddit\n"))
	}))
	defer redditServer.Close()
	redditHandler, _ := handler.NewProxyHandler(logger, redditServer.URL)

	queryServer := httptest.NewServer(http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		rw.WriteHeader(202)
		rw.Write([]byte("Hi from query\n"))
	}))
	defer queryServer.Close()
	queryHandler, _ := handler.NewProxyHandler(logger, queryServer.URL)

	// set up (real) api server
	serverHandler := server.NewServer(mw, redditHandler, queryHandler)
	server := httptest.NewServer(serverHandler)
	defer server.Close()

	// this test should not produce a superfluous response.WriteHeader call
	t.Run("does not fail with superfluous response.WriteHeader call on PUT /posts/{id} route", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodPut, server.URL+"/posts/post123", nil)
		req.Header.Set("Authorization", "bearer 12345")

		res, err := http.DefaultClient.Do(req)

		if err != nil {
			t.Errorf("Reason: %s", err)
		}

		got := res.StatusCode
		want := 203

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})

	// this test should not produce a superfluous response.WriteHeader call
	// and an invalid Read on closed Body
	t.Run("does not fail with multiple read from body on PUT /posts/{id} route", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodPut, server.URL+"/posts/post123", strings.NewReader("hello"))
		req.Header.Set("Authorization", "bearer 12345")

		res, err := http.DefaultClient.Do(req)

		if err != nil {
			t.Errorf("Reason: %s", err)
		}

		got := res.StatusCode
		want := 203

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})
}
