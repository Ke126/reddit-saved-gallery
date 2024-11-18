package jwt_test

import (
	"testing"

	"github.com/Ke126/reddit-saved-gallery/internal/jwt"
)

func TestFromString(t *testing.T) {
	t.Run("returns err for string without 3 parts", func(t *testing.T) {
		input := "abc.123"
		_, err := jwt.FromString(input)

		if err == nil {
			t.Error("did not return error")
		}
	})

	t.Run("returns err for string which is not base64 encoded", func(t *testing.T) {
		input := "%(*@#^()).%)@%().%@#^@"
		_, err := jwt.FromString(input)

		if err == nil {
			t.Error("did not return error")
		}
	})

	t.Run("returns err for string which is valid jwt but is missing aid claim", func(t *testing.T) {
		input := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
		_, err := jwt.FromString(input)

		if err == nil {
			t.Error("did not return error")
		}
	})

	t.Run("returns token for string which is valid jwt with aid claim", func(t *testing.T) {
		input := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJhaWQiOiJib2IxMjM0NSJ9.4dYBLwh8ZYLjqdcnSoczYHWXU0wjdiZCHQjZ46bYDgc"
		token, err := jwt.FromString(input)

		if err != nil {
			t.Error("returned error")
		}

		gotRaw := token.Raw
		wantRaw := input

		if gotRaw != wantRaw {
			t.Errorf("got %s, want %s", gotRaw, wantRaw)
		}

		gotAid := token.Claims.Aid
		wantAid := "bob12345"

		if gotAid != wantAid {
			t.Errorf("got %s, want %s", gotAid, wantAid)
		}
	})

	t.Run("returns token for another string which is valid jwt with aid claim", func(t *testing.T) {
		input := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhaWQiOiJnb3VsYXNoIn0.3seiv0iz2-bug-TZK_DrbPBZ3SwxDyvSsxUsEUJJSN0"
		token, _ := jwt.FromString(input)

		gotRaw := token.Raw
		wantRaw := input

		if gotRaw != wantRaw {
			t.Errorf("got %s, want %s", gotRaw, wantRaw)
		}

		gotAid := token.Claims.Aid
		wantAid := "goulash"

		if gotAid != wantAid {
			t.Errorf("got %s, want %s", gotAid, wantAid)
		}
	})
}
