# Reddit Saved Manager

This repository contains all the necessary services to run a web application allowing users to view, filter, and manage their saved Reddit posts.

This repository should only exist on the developer machine. The remote host machine should not have any source code. The GitHub workflow `deploy.yaml` will automate building the source code into Docker images and deploying the application to the remote server via SSH.

## Setup
**Developer machine**
1. Clone this repository and sync to a remote GitHub repository if not done already.

**Remote host machine**
1. Install Docker.
2. Set up user:
    1. Create new Linux user.
    2. Set up SSH authenticated keys.
    3. Modify `/etc/sudoers.d` to be able to run Docker commands as root without authentication, i.e. `sudo docker compose up`.
3. Create an `.env` file with at least the following properties:
    - DOMAIN = the web domain (ex. hipster.one)
    - MONGO_INITDB_ROOT_USERNAME = mongodb username
    - MONGO_INITDB_ROOT_PASSWORD = mongodb password
    - OAUTH_CLIENT_ID = OAuth client id from Reddit
    - OAUTH_CLIENT_SECRET = OAuth client secret from Reddit
    - AES_KEY = 256 bit AES key encoded as base64
    - AES_IV = 128 bit AES iv encoded as base64
4. Copy the SSH private key and output of `ssh-keyscan -H ${hostname}`.

**GitHub**
1. Create GitHub repository secrets:
    - SSH_KEY: SSH private key for remote machine
    - SSH_KEYSCAN: output of running `ssh-keyscan -H ${hostname}`
    - USER: SSH username
    - HOSTNAME: SSH ip address

## How to deploy (from developer computer):
1. Merge a pull request to remote main branch on Github (or manually invoke action on Github).

## How to deploy (from remote host machine):
1. Run `sudo docker compose up`.
