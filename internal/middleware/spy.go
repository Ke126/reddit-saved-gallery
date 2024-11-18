package middleware

import "net/http"

// statusCodeSpy is a spy which implements the http.ResponseWriter interface.
// This allows the status code to be recorded for logging purposes
type statusCodeSpy struct {
	StatusCode int
	http.ResponseWriter
}

func NewStatusCodeSpy(rw http.ResponseWriter) *statusCodeSpy {
	return &statusCodeSpy{-1, rw}
}

// WriteHeader() intercepts calls to the underlying WriteHeader() method
// and records the status code
func (s *statusCodeSpy) WriteHeader(statusCode int) {
	s.StatusCode = statusCode
	s.ResponseWriter.WriteHeader(statusCode)
}

// Write() intercepts calls to the underlying Write() method
// and records the implicit http.StatusOK status code
func (s *statusCodeSpy) Write(buf []byte) (int, error) {
	if s.StatusCode == -1 {
		s.StatusCode = http.StatusOK
	}
	return s.ResponseWriter.Write(buf)
}
