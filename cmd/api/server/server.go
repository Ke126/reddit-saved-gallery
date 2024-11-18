package server

import "net/http"

type middleware interface {
	CheckAuth(next http.Handler) http.Handler
	LogRequest(next http.Handler) http.Handler
}

func NewServer(mw middleware, redditHandler http.Handler, queryHandler http.Handler) http.Handler {
	mux := http.NewServeMux()
	addRoutes(mux, redditHandler, queryHandler)
	var handler http.Handler = mux
	handler = mw.CheckAuth(handler)
	handler = mw.LogRequest(handler)
	return handler
}
