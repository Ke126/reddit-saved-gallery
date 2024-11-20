package middleware_test

import (
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Ke126/reddit-saved-gallery/internal/middleware"
)

func makeOKHandler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
}

func TestCheckAuth(t *testing.T) {
	slogger := slog.Default()
	mw := middleware.NewMiddleware(slogger)
	handler := makeOKHandler()
	authMW := mw.CheckAuth(handler)

	t.Run("returns Unauthorized when Authorization header is missing", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		res := httptest.NewRecorder()

		authMW.ServeHTTP(res, req)

		got := res.Result().StatusCode
		want := http.StatusUnauthorized

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})
	t.Run("returns Unauthorized when Authorization header is empty string", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.Header.Set("Authorization", "")
		res := httptest.NewRecorder()

		authMW.ServeHTTP(res, req)

		got := res.Result().StatusCode
		want := http.StatusUnauthorized

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})

	t.Run("returns Unauthorized when Authorization header does not start with bearer", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.Header.Set("Authorization", "a.a.a")
		res := httptest.NewRecorder()

		authMW.ServeHTTP(res, req)

		got := res.Result().StatusCode
		want := http.StatusUnauthorized

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})

	t.Run("returns Unauthorized when Authorization header is too short", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.Header.Set("Authorization", "bearer a.a.")
		res := httptest.NewRecorder()

		authMW.ServeHTTP(res, req)

		got := res.Result().StatusCode
		want := http.StatusUnauthorized

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})

	t.Run("calls next when Authorization header starts with bearer", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.Header.Set("Authorization", "bearer a.a.a")
		res := httptest.NewRecorder()

		authMW.ServeHTTP(res, req)

		got := res.Result().StatusCode
		want := http.StatusOK

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})
}

func TestLogRequest(t *testing.T) {
	slogger := slog.Default()
	mw := middleware.NewMiddleware(slogger)
	handler := makeOKHandler()
	logMW := mw.LogRequest(handler)

	t.Run("calls next", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/route?a=5&b=61", nil)
		res := httptest.NewRecorder()
		logMW.ServeHTTP(res, req)

		got := res.Result().StatusCode
		want := http.StatusOK

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})
}
