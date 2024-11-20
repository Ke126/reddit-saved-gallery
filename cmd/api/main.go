package main

import (
	"log"
	"log/slog"
	"net/http"
	"os"

	"github.com/Ke126/reddit-saved-gallery/cmd/api/handler"
	"github.com/Ke126/reddit-saved-gallery/cmd/api/server"
	"github.com/Ke126/reddit-saved-gallery/internal/middleware"
)

func main() {
	logger := slog.Default()
	mw := middleware.NewMiddleware(logger)

	redditUrl := os.Getenv("REDDIT_SERVICE_ADDR")
	if redditUrl == "" {
		panic("REDDIT_SERVICE_ADDR is empty")
	}
	redditHandler, err := handler.NewProxyHandler(logger, "http://"+redditUrl)
	if err != nil {
		panic(err)
	}

	queryUrl := os.Getenv("QUERY_SERVICE_ADDR")
	if queryUrl == "" {
		panic("QUERY_SERVICE_ADDR is empty")
	}
	queryHandler, err := handler.NewProxyHandler(logger, "http://"+queryUrl)
	if err != nil {
		panic(err)
	}

	server := server.NewServer(mw, redditHandler, queryHandler)
	port := os.Getenv("PORT")
	if port == "" {
		panic("PORT is empty")
	}

	logger.Info("Listening on port " + port)
	log.Fatal(http.ListenAndServe(":"+port, server))
}
