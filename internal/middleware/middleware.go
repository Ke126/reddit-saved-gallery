package middleware

import (
	"fmt"
	"log/slog"
	"net/http"
	"strings"
	"time"
)

type middleware struct {
	logger *slog.Logger
}

func NewMiddleware(logger *slog.Logger) *middleware {
	return &middleware{logger}
}

func (m *middleware) CheckAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		header := strings.ToLower(r.Header.Get("Authorization"))
		if !strings.HasPrefix(header, "bearer ") || len(header) < 12 {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (m *middleware) LogRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		full := r.URL.Path
		if r.URL.RawQuery != "" {
			full = full + "?" + r.URL.RawQuery
		}
		msg := fmt.Sprintf("%s %s", r.Method, full)
		m.logger.Info(msg)

		// spy on the status code for logging purposes
		spy := NewStatusCodeSpy(w)
		next.ServeHTTP(spy, r)

		elapsed := float64(time.Since(start)) / float64(time.Millisecond)
		msg = fmt.Sprintf("%s %s %d - %.3f ms", r.Method, full, spy.StatusCode, elapsed)
		m.logger.Info(msg)
	})
}
