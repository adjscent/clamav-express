#!/bin/sh
set -e
service clamav-daemon start
pnpm start
