package handler

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/Ke126/reddit-saved-gallery/internal/jwt"
	"github.com/Ke126/reddit-saved-gallery/internal/status"
)

type redditHandler struct {
	service redditService
}

type redditService interface {
	PullPosts(accessToken string, username string) error
	SavePost(accessToken string, id string) error
	UnsavePost(accessToken string, id string) error
}

func NewRedditHandler(service redditService) *redditHandler {
	return &redditHandler{service}
}

func (rh *redditHandler) HandlePullPosts(w http.ResponseWriter, r *http.Request) {
	// header is guaranteed to be length >= 13 based on middleware
	tokenString := r.Header.Get("Authorization")[7:]
	token, err := jwt.FromString(tokenString)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	var bodyStruct struct {
		Username string `json:"username"`
	}
	err = json.NewDecoder(r.Body).Decode(&bodyStruct)

	if err != nil || bodyStruct.Username == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err = rh.service.PullPosts(token.Raw, bodyStruct.Username)

	if err != nil {
		var fetchError *status.FetchStatusErr
		if errors.As(err, &fetchError) {
			w.WriteHeader(fetchError.StatusCode)
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusAccepted)
}

func (rh *redditHandler) HandleSavePost(w http.ResponseWriter, r *http.Request) {
	rh.doHandleSavePost(w, r, true)
}

func (rh *redditHandler) HandleUnsavePost(w http.ResponseWriter, r *http.Request) {
	rh.doHandleSavePost(w, r, false)
}

func (rh *redditHandler) doHandleSavePost(w http.ResponseWriter, r *http.Request, save bool) {
	// header is guaranteed to be length >= 13 based on middleware
	tokenString := r.Header.Get("Authorization")[7:]
	token, err := jwt.FromString(tokenString)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	id := r.PathValue("id")

	// Should never be possible, since the mux will not match requests to /posts/.
	if id == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if save {
		err = rh.service.SavePost(token.Raw, id)
	} else {
		err = rh.service.UnsavePost(token.Raw, id)
	}

	if err != nil {
		var fetchError *status.FetchStatusErr
		if errors.As(err, &fetchError) {
			w.WriteHeader(fetchError.StatusCode)
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusAccepted)
}
