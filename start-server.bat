@echo off
echo Starting NestMate Payment Server...
cd server
set PATH=%PATH%;C:\Program Files\nodejs
node payment-server.js
pause

