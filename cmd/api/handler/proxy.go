package handler

import (
	"log/slog"
	"net/http"
	"net/http/httputil"
	"net/url"
)

// proxyHandler forwards all http requests to the url of the proxy handler
type proxyHandler struct {
	logger  *slog.Logger
	url     string
	handler http.Handler
}

// NewProxyHandler returns a handler that proxies all HTTP requests to the desired URL
func NewProxyHandler(logger *slog.Logger, urlString string) (*proxyHandler, error) {
	url, err := url.Parse(urlString)
	if err != nil {
		return nil, err
	}
	proxy := httputil.NewSingleHostReverseProxy(url)
	return &proxyHandler{logger, urlString, proxy}, nil
}

func (p *proxyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	msg := "Proxied request to " + p.url
	p.logger.Info(msg)
	p.handler.ServeHTTP(w, r)
}
