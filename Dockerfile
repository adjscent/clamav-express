FROM node:20-slim

RUN apt-get update && \
    apt-get install -y clamav clamav-daemon && \
    rm -rf /var/lib/apt/lists/*

RUN freshclam

WORKDIR /app
COPY . .

RUN npm install -g pnpm && pnpm install

EXPOSE 3000

RUN chmod +x entrypoint.sh
CMD ["./entrypoint.sh"]
