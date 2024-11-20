package status_test

import (
	"net/http"
	"testing"

	"github.com/Ke126/reddit-saved-gallery/internal/status"
)

func TestOk(t *testing.T) {
	tests := []struct {
		status int
		want   bool
	}{
		{http.StatusEarlyHints, false},      // 103
		{http.StatusOK, true},               // 200
		{http.StatusCreated, true},          // 201
		{http.StatusMultipleChoices, false}, // 300
	}
	for _, tt := range tests {
		t.Run("", func(t *testing.T) {
			got := status.Ok(tt.status)

			if got != tt.want {
				t.Errorf("got %t, want %t", got, tt.want)
			}
		})
	}
}
