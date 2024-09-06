#!/bin/sh

# run certbot in standalone mode
echo "Started requesting new certificate for $DOMAIN"
certbot certonly --standalone --register-unsafely-without-email --agree-tos --domain $DOMAIN
echo "Successfully obtained new certificate for $DOMAIN"