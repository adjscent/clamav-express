FROM node:20-slim

RUN apt-get update && \
    apt-get install -y clamav clamav-daemon && \
    rm -rf /var/lib/apt/lists/*


RUN sed -i 's/LogFile \/var\/log\/clamav\/clamav.log/LogFile \/tmp\/clamav.log/g' /etc/clamav/clamd.conf
RUN sed -i 's/LocalSocket \/var\/run\/clamav\/clamd.ctl/LocalSocket \/tmp\/clamd.ctl/g' /etc/clamav/clamd.conf

RUN freshclam

WORKDIR /app
COPY . .

RUN npm install -g pnpm && pnpm install

EXPOSE 3000

RUN chmod +x entrypoint.sh
CMD ["./entrypoint.sh"]
