package server

import (
	"bytes"
	"io"
	"net/http"
	"net/http/httptest"
)

// adds all the routes
func addRoutes(mux *http.ServeMux, redditHandler http.Handler, queryHandler http.Handler) {
	// TODO: clean up this function
	both := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// recorders
		recorder1 := httptest.NewRecorder()
		recorder2 := httptest.NewRecorder()

		// copy of the body
		body, err := io.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		// write into the recorders
		r.Body = io.NopCloser(bytes.NewBuffer(body))
		queryHandler.ServeHTTP(recorder1, r)
		r.Body = io.NopCloser(bytes.NewBuffer(body))
		redditHandler.ServeHTTP(recorder2, r)

		// send the status code based on recorders to avoid fix superfluous response.WriteHeader call
		w.WriteHeader(max(recorder1.Result().StatusCode, recorder2.Result().StatusCode))
	})

	mux.Handle("GET /posts", queryHandler)        // read
	mux.Handle("POST /posts", redditHandler)      // pull
	mux.Handle("PUT /posts/{id}", both)           // save
	mux.Handle("PATCH /posts/{id}", queryHandler) // pin/unpin
	mux.Handle("DELETE /posts/{id}", both)        // unsave

	mux.Handle("GET /subreddits", queryHandler)
}
