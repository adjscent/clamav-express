  
# ClamAV Express Server [![CI Unit Test](https://github.com/adjscent/clamav-express/actions/workflows/ci.yml/badge.svg)](https://github.com/adjscent/clamav-express/actions/workflows/ci.yml)



This project is a simple Express server that accepts file uploads as a blob and scans them using ClamAV (clamdscan) via the [clamscan](https://github.com/kylefarris/clamscan) Node.js library.

## Usage

### Local Development

1. Install dependencies:
   ```sh
   pnpm install
   ```
2. Start ClamAV daemon (clamd) on your system.
3. Start the server:
   ```sh
   pnpm start
   ```
4. POST a file to `http://localhost:3000/scan` with the form field `file`.

### Docker

1. Build the Docker image:
   ```sh
   docker build -t clamav-express-server .
   ```
2. Run the container:
   ```sh
   docker run -p 3000:3000 clamav-express-server
   ```

## API

- `POST /scanstream` — Upload a file (form field: `file`). Returns scan result.
- `POST /scanfile` — Upload a file (form field: `file`). Returns scan result.

Example
```
curl --data-binary @DANGER -H "Content-Type: application/octet-stream" http://localhost:3000/scanfile
curl --data-binary @DANGER -H "Content-Type: application/octet-stream" http://localhost:3000/scanstream
```

## Notes
- The container starts both the ClamAV daemon and the Node.js server.
- Make sure the ClamAV database is up to date for best results.
