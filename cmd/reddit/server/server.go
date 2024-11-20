package server

import "net/http"

type middleware interface {
	CheckAuth(next http.Handler) http.Handler
	LogRequest(next http.Handler) http.Handler
}

type handler interface {
	HandlePullPosts(w http.ResponseWriter, r *http.Request)
	HandleSavePost(w http.ResponseWriter, r *http.Request)
	HandleUnsavePost(w http.ResponseWriter, r *http.Request)
}

func NewServer(mw middleware, redditHandler handler) http.Handler {
	mux := http.NewServeMux()
	addRoutes(mux, redditHandler)
	var handler http.Handler = mux
	handler = mw.CheckAuth(handler)
	handler = mw.LogRequest(handler)
	return handler
}
