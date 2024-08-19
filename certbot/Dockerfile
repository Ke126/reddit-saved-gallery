FROM ubuntu:latest

# Install Certbot and Docker
RUN apt-get update && apt-get install -y certbot && apt-get install -y docker.io

# # Install nginx plugin
# RUN apt-get install python3-certbot-nginx

COPY ./ ./

RUN chmod +x ./healthcheck.sh ./new-cert.sh ./renew.sh ./startup.sh

HEALTHCHECK --interval=3s --timeout=3s --start-period=5s --retries=10 CMD [ "./healthcheck.sh" ]

CMD ["./startup.sh"]