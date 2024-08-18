#!/usr/bin/env bash

# run certbot in standalone mode
certbot certonly --standalone --register-unsafely-without-email --agree-tos --domain $DOMAIN

# switch to webroot renewal
CONFIG_FILE="/etc/letsencrypt/renewal/$DOMAIN.conf"
sed -i "s/authenticator = standalone/authenticator = webroot/g" "$CONFIG_FILE"
echo -e "[[webroot_map]]\n$DOMAIN = /var/lib/letsencrypt\n" >> "$CONFIG_FILE"
