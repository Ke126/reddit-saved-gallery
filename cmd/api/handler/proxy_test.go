package handler_test

import (
	"bytes"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Ke126/reddit-saved-gallery/cmd/api/handler"
)

// returns a test server which only responds with OK for requests with the correct method, path, query, headers and body
func makeTestServer(method string, path string, rawQuery string, headers http.Header, body string) *httptest.Server {
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// compare method
		if r.Method != method {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		// compare path
		if r.URL.Path != path {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		// compare query
		if r.URL.RawQuery != rawQuery {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		// compare headers
		for k := range headers {
			if fmt.Sprint(r.Header[k]) != fmt.Sprint(headers[k]) {
				w.WriteHeader(http.StatusBadRequest)
				return
			}
		}
		// compare body
		readBody, err := io.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if string(readBody) != body {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		w.WriteHeader(http.StatusOK)
	}))
}

func TestForward(t *testing.T) {
	expectedHeaders := http.Header(make(map[string][]string))
	expectedHeaders.Set("Some-Header", "some-value")
	server := makeTestServer("POST", "/test", "a=123&b=hello", expectedHeaders, `{"prop1":"val1","prop2":2}`)
	defer server.Close()
	slogger := slog.Default()
	handler, _ := handler.NewProxyHandler(slogger, server.URL)

	t.Run("returns BadRequest on wrong method", func(t *testing.T) {
		request := httptest.NewRequest(http.MethodGet, "/", nil)
		response := httptest.NewRecorder()
		handler.ServeHTTP(response, request)

		got := response.Result().StatusCode
		want := http.StatusBadRequest

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})

	t.Run("returns BadRequest on right method, wrong path", func(t *testing.T) {
		request := httptest.NewRequest(http.MethodPost, "/test1", nil)
		response := httptest.NewRecorder()
		handler.ServeHTTP(response, request)

		got := response.Result().StatusCode
		want := http.StatusBadRequest

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})

	t.Run("returns BadRequest on right method, right path, wrong query", func(t *testing.T) {
		request := httptest.NewRequest(http.MethodPost, "/test?a=123", nil)
		response := httptest.NewRecorder()
		handler.ServeHTTP(response, request)

		got := response.Result().StatusCode
		want := http.StatusBadRequest

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})

	t.Run("returns BadRequest on right method, right path, right query, wrong headers", func(t *testing.T) {
		request := httptest.NewRequest(http.MethodPost, "/test?a=123&b=hello", nil)
		response := httptest.NewRecorder()
		handler.ServeHTTP(response, request)

		got := response.Result().StatusCode
		want := http.StatusBadRequest

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})

	t.Run("returns BadRequest on right method, right path, right query, right headers, wrong body", func(t *testing.T) {
		request := httptest.NewRequest(http.MethodPost, "/test?a=123&b=hello", nil)
		request.Header.Set("Some-Header", "some-value")
		response := httptest.NewRecorder()
		handler.ServeHTTP(response, request)

		got := response.Result().StatusCode
		want := http.StatusBadRequest

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})

	t.Run("returns OK on right method, right path, right query, right headers, right body", func(t *testing.T) {
		request := httptest.NewRequest(http.MethodPost, "/test?a=123&b=hello", bytes.NewBuffer([]byte(`{"prop1":"val1","prop2":2}`)))
		request.Header.Set("Some-Header", "some-value")
		response := httptest.NewRecorder()
		handler.ServeHTTP(response, request)

		got := response.Result().StatusCode
		want := http.StatusOK

		if got != want {
			t.Errorf("got %d, want %d", got, want)
		}
	})
}
