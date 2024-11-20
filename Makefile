.PHONY: build
build:
	CGO_ENABLED=0 GOARCH=arm64 go build -o ./cmd/api/api ./cmd/api/
	CGO_ENABLED=0 GOARCH=arm64 go build -o ./cmd/reddit/reddit ./cmd/reddit/

.PHONY: docker
docker: build
	docker compose build

.PHONY: clean
clean:
	rm -f ./cmd/api/api
	rm -f ./cmd/reddit/reddit

.PHONY: test
test:
	go test ./...
