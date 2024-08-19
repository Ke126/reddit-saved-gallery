#!/usr/bin/env bash

# obtain new cert if healthcheck fails, then run renewal script
./healthcheck.sh || ./new-cert.sh; ./renew.sh
