package status_test

import (
	"errors"
	"fmt"
	"net/http"
	"testing"

	"github.com/Ke126/reddit-saved-gallery/internal/status"
)

func TestFetchStatusErr(t *testing.T) {
	t.Run("is an instance of FetchStatusErr", func(t *testing.T) {
		var out *status.FetchStatusErr
		err := &status.FetchStatusErr{http.StatusNotFound}

		if !errors.As(err, &out) {
			t.Errorf("is not")
		}
	})

	t.Run("wraps correctly", func(t *testing.T) {
		err1 := &status.FetchStatusErr{http.StatusNotFound}
		err2 := fmt.Errorf("wrapped: %w", err1)

		if !errors.Is(err2, err1) {
			t.Errorf("does not")
		}
	})
}
