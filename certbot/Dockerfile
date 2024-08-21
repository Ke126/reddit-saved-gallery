FROM alpine:latest

# install curl and certbot
RUN apk add curl && apk add certbot

# install nginx plugin
# RUN apt-get install python3-certbot-nginx

COPY ./ ./

RUN chmod +x ./healthcheck.sh ./new-cert.sh ./renew.sh ./startup.sh

HEALTHCHECK --interval=3s --timeout=3s --start-period=5s --retries=10 CMD [ "./healthcheck.sh" ]

CMD ["./startup.sh"]