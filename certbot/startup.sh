#!/bin/sh

# obtain new cert if healthcheck fails, then run renewal script
./healthcheck.sh || ./new-cert.sh; ./renew.sh
