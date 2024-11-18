package jwt

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"strings"
)

type jwt struct {
	Raw    string
	Claims claims
}

type claims struct {
	Aid string `json:"aid"`
}

// FromString returns the *jwt or error which results from parsing jwtString
func FromString(jwtString string) (*jwt, error) {
	// header, payload, signature
	parts := strings.Split(jwtString, ".")
	if len(parts) != 3 {
		return nil, errors.New("token parse error")
	}
	payload := parts[1]
	decoded, err := base64.RawURLEncoding.DecodeString(payload)
	if err != nil {
		return nil, err
	}
	var claims claims
	err = json.Unmarshal(decoded, &claims)
	if err != nil {
		return nil, err
	}
	if claims.Aid == "" {
		return nil, errors.New("missing or empty aid error")
	}
	return &jwt{Raw: jwtString, Claims: claims}, nil
}
