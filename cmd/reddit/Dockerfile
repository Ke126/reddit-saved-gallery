FROM gcr.io/distroless/static-debian12
COPY ./reddit ./reddit
ENV QUERY_SERVICE_ADDR=query:4001
ENV PORT=4002
EXPOSE $PORT
CMD ["./reddit"]
