package env

import (
	"fmt"
	"os"
	"strings"
)

// URLFromEnv expects an existing key=value pair such as
// QUERY_SERVICE_ADDR=query:3000,
// and concats the scheme http to the returned url, such as http://query:3000
func URLFromEnv(key string) (string, error) {
	val := os.Getenv(key)
	if len(val) == 0 {
		return "", fmt.Errorf("value of key %s is empty", key)
	}
	// append scheme if not already present
	if !strings.HasPrefix(val, "http://") {
		val = "http://" + val
	}
	return val, nil
}

// SecretFromEnv expects an existing key=value pair such as
// SECRET_NAME=my_secret in development, or
// SECRET_NAME_FILE=path_to_my_secret in production, and
// retrieves the secret accordingly
func SecretFromEnv(key string) (string, error) {
	// prefer reading from file first
	val := os.Getenv(key + "_FILE")
	if len(val) == 0 {
		// read from env
		val = os.Getenv(key)
		if val == "" {
			return "", fmt.Errorf("value of key %s is empty", key)
		}
		return val, nil
	} else {
		// read from secret file
		file, err := os.ReadFile(val)
		if err != nil {
			return "", fmt.Errorf("error reading file %s", val)
		}
		return string(file), nil
	}
}
