FROM ubuntu:latest

# Install Certbot and Docker
RUN apt-get update && apt-get install -y certbot && apt-get install -y docker.io

# # Install nginx plugin
# RUN apt-get install python3-certbot-nginx

COPY ./renew.sh ./renew.sh
COPY ./standalone.sh ./standalone.sh

RUN chmod +x ./renew.sh ./standalone.sh

CMD ["/bin/bash", "./renew.sh"]