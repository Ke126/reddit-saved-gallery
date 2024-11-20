package env_test

import (
	"os"
	"testing"

	"github.com/Ke126/reddit-saved-gallery/internal/env"
)

func makeTempFile(name string, contents string) (string, error) {
	// create file
	f, err := os.CreateTemp("", name)
	if err != nil {
		return "", err
	}
	// write to file
	if _, err := f.Write([]byte(contents)); err != nil {
		os.Remove(f.Name())
		return "", err
	}
	return f.Name(), nil
}

func TestUrlFromEnv(t *testing.T) {
	t.Run("returns error when key is unset", func(t *testing.T) {
		_, err := env.URLFromEnv("SOME_KEY")

		if err == nil {
			t.Errorf("failed")
		}
	})

	t.Run("returns error when key is set and empty", func(t *testing.T) {
		t.Setenv("SOME_KEY", "")
		_, err := env.URLFromEnv("SOME_KEY")

		if err == nil {
			t.Errorf("failed")
		}
	})

	t.Run("returns url when key is set and nonempty", func(t *testing.T) {
		t.Setenv("SOME_KEY", "ip_addr:1234")
		got, _ := env.URLFromEnv("SOME_KEY")
		want := "http://ip_addr:1234"

		if got != want {
			t.Errorf("got %s, want %s", got, want)
		}
	})
}

func TestSecretFromEnv(t *testing.T) {
	t.Run("returns error when both SECRET and SECRET_FILE are unset", func(t *testing.T) {
		_, err := env.SecretFromEnv("SOME_SECRET")

		if err == nil {
			t.Errorf("failed")
		}
	})

	t.Run("returns error when only SECRET_FILE is set but file does not exist", func(t *testing.T) {
		t.Setenv("SOME_SECRET_FILE", "/some/random/path")
		_, err := env.SecretFromEnv("SOME_SECRET")

		if err == nil {
			t.Errorf("failed")
		}
	})

	t.Run("returns secret when only SECRET_FILE is set and file exists", func(t *testing.T) {
		fName, _ := makeTempFile("my_secret", "secret123")
		defer os.Remove(fName)
		t.Setenv("SOME_SECRET_FILE", fName)
		got, _ := env.SecretFromEnv("SOME_SECRET")
		want := "secret123"

		if got != want {
			t.Errorf("got %s, want %s", got, want)
		}
	})

	t.Run("returns secret when only SECRET is set", func(t *testing.T) {
		t.Setenv("SOME_SECRET", "secret123")
		got, _ := env.SecretFromEnv("SOME_SECRET")

		want := "secret123"

		if got != want {
			t.Errorf("got %s, want %s", got, want)
		}
	})

	t.Run("returns secret from file when both SECRET_FILE and SECRET are set", func(t *testing.T) {
		fName, _ := makeTempFile("my_secret", "secret_from_file")
		defer os.Remove(fName)
		t.Setenv("SOME_SECRET_FILE", fName)
		t.Setenv("SOME_SECRET", "secret_from_env")
		got, _ := env.SecretFromEnv("SOME_SECRET")

		want := "secret_from_file"

		if got != want {
			t.Errorf("got %s, want %s", got, want)
		}
	})
}
