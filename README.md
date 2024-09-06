# Reddit Saved Gallery

[Reddit Saved Gallery](https://hipster.one) is a SaaS web application allowing users to view, filter, and manage their saved Reddit posts.

This repository contains all the necessary services to host Reddit Saved Gallery. None of the source code in this repository needs to be downloaded to the host machine. The GitHub workflow [deploy.yaml](./.github/workflows/deploy.yaml) will automate building the Docker images and deploying the application to the host machine via SSH.

## Table of contents

- [Setup and installation](#setup-and-installation)
    - [Developer machine](#developer-machine)
    - [Host machine](#host-machine)
    - [GitHub secrets](#github-secrets)
    - [Reddit](#reddit)
    - [DNS](#dns)
- [Environment file](#environment-file)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
    - [Planned features](#planned-features)
    - [Other improvements](#other-improvements)

## Setup and installation

### Developer machine
1. Clone this repository and publish to a remote GitHub repository (if not done already).

### Host machine
1. Install Docker.
2. Set up user:
    1. Create new Linux user.
    2. Set up SSH key-based authentication.
    3. Modify sudo permissions to run Docker commands as root without password authentication, i.e. `sudo docker compose up`.
3. Copy the SSH private key and output of running `ssh-keyscan -H ${hostname}`.

### GitHub secrets
1. Create GitHub repository secrets:
    - SSH_PRIVATE_KEY: SSH private key for remote machine
    - SSH_KNOWN_HOSTS: output of running `ssh-keyscan -H ${hostname}`
    - USER: host machine's SSH username
    - HOSTNAME: host machine's SSH ip address
    - ENV_FILE: see [Environment file](#environment-file)

### Reddit
1. Create a new Reddit web app [here](https://www.reddit.com/prefs/apps).
2. Register Reddit app with the redirect URI `https://$DOMAIN/callback`.
3. Copy the app's client id and client secret.

### DNS
1. Create a DNS A record for the host machine's ip address.

## Environment file

The environment file defines certain environment variables and secrets to be consumed by the application services when running `docker compose up`. The following are required:
- DOMAIN = the domain name
- MONGO_INITDB_ROOT_USERNAME = mongodb username
- MONGO_INITDB_ROOT_PASSWORD = mongodb password
- OAUTH_CLIENT_ID = OAuth client id from Reddit
- OAUTH_CLIENT_SECRET = OAuth client secret from Reddit
- AES_KEY = 256 bit AES key encoded as base64
- AES_IV = 128 bit AES initialization vector encoded as base64

These values should all be saved as a single GitHub secret named `ENV_FILE` (see [Github secrets](#github-secrets)).

## Deployment

Deployment is automated by the continuous deployment (CD) workflow defined in `deploy.yaml`. This workflow can be triggered by a `push` event to the main branch on GitHub, or by manually invoking the workflow on GitHub Actions.

## Roadmap

Development of Reddit Saved Gallery is still ongoing. The following are some of the enhancements planned for future updates to Reddit Saved Gallery:

### Website features

- [ ] Display subreddit icons
- [ ] Add post ordering filters
- [ ] Improve UI
- [ ] Stream Reddit videos using DASH/HLS
- [ ] View all images from Reddit galleries
- [ ] Create favicon/logo
- [ ] Export all posts to .json

### Other improvements

- [x] Utilize GitHub Actions cache for Docker build
- [x] Reduce size of cert-manager image
- [ ] Add observability using OpenTelemetry logs, metrics, and traces
- [ ] Use Kubernetes for orchestration
- [ ] Implement CI pipeline for testing
- [ ] Utilize GitHub Container Registry to store built images
- [ ] Set up automated linting and formatting
- [ ] Automate Cloudflare client certificate management for mTLS
