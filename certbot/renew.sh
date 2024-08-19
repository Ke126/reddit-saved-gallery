#!/usr/bin/env bash

# attempt renewal every 23 hours
echo "Started running renewal script"
while true; do
    # certbot renew --deploy-hook "sudo docker exec reddit-app-nginx-1 nginx -s reload"
    certbot renew --dry-run
    sleep 82800
done