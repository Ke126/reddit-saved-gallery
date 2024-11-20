package server

import (
	"net/http"
)

// adds all the routes
func addRoutes(mux *http.ServeMux, redditHandler handler) {
	mux.HandleFunc("POST /posts", redditHandler.HandlePullPosts)         // pull
	mux.HandleFunc("PUT /posts/{id}", redditHandler.HandleSavePost)      // save
	mux.HandleFunc("DELETE /posts/{id}", redditHandler.HandleUnsavePost) // unsave
}
