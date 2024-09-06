#!/bin/sh

# attempt renewal every 23 hours
echo "Started running renewal script"
NGINX_CONTAINER_NAME="reddit-app-nginx-1"

while true; do
    certbot renew --deploy-hook "curl --unix-socket /var/run/docker.sock -X POST http://localhost/v1.44/containers/$NGINX_CONTAINER_NAME/kill?signal=SIGHUP"
    # certbot renew --dry-run
    sleep 82800
done