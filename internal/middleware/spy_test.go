package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Ke126/reddit-saved-gallery/internal/middleware"
)

func TestStatusCodeSpy(t *testing.T) {
	t.Run("records and forwards status code written to the spy using WriteHeader()", func(t *testing.T) {
		res := httptest.NewRecorder()
		spy := middleware.NewStatusCodeSpy(res)

		spy.WriteHeader(http.StatusTeapot)

		got1 := spy.StatusCode
		got2 := res.Result().StatusCode
		want := http.StatusTeapot

		if got1 != want {
			t.Errorf("got %d, want %d", got1, want)
		}
		if got2 != want {
			t.Errorf("got %d, want %d", got2, want)
		}
	})

	t.Run("records and forwards implicit 200 status code written to the spy using Write()", func(t *testing.T) {
		res := httptest.NewRecorder()
		spy := middleware.NewStatusCodeSpy(res)

		spy.Write([]byte("hi"))

		got1 := spy.StatusCode
		got2 := res.Result().StatusCode
		want := http.StatusOK

		if got1 != want {
			t.Errorf("got %d, want %d", got1, want)
		}
		if got2 != want {
			t.Errorf("got %d, want %d", got2, want)
		}
	})

	t.Run("records and forwards correct status code written to the spy using both WriteHeader() and Write()", func(t *testing.T) {
		res := httptest.NewRecorder()
		spy := middleware.NewStatusCodeSpy(res)

		spy.WriteHeader(http.StatusTeapot)
		spy.Write([]byte("hi"))

		got1 := spy.StatusCode
		got2 := res.Result().StatusCode
		want := http.StatusTeapot

		if got1 != want {
			t.Errorf("got %d, want %d", got1, want)
		}
		if got2 != want {
			t.Errorf("got %d, want %d", got2, want)
		}
	})
}
