package main

import (
	"log"
	"log/slog"
	"net/http"
	"os"

	"github.com/Ke126/reddit-saved-gallery/cmd/reddit/handler"
	"github.com/Ke126/reddit-saved-gallery/cmd/reddit/server"
	"github.com/Ke126/reddit-saved-gallery/cmd/reddit/service"
	"github.com/Ke126/reddit-saved-gallery/internal/middleware"
)

func main() {
	logger := slog.Default()
	mw := middleware.NewMiddleware(logger)

	queryUrl := os.Getenv("QUERY_SERVICE_ADDR")
	if queryUrl == "" {
		panic("QUERY_SERVICE_ADDR is empty")
	}
	redditService := service.NewRedditService(logger, http.DefaultClient, "http://"+queryUrl)
	redditHandler := handler.NewRedditHandler(redditService)

	server := server.NewServer(mw, redditHandler)
	port := os.Getenv("PORT")
	if port == "" {
		panic("PORT is empty")
	}

	logger.Info("Listening on port " + port)
	log.Fatal(http.ListenAndServe(":"+port, server))
}
