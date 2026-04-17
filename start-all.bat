@echo off
echo Starting NagarSetu Backend...
start cmd /k "cd server && npm.cmd start"

echo Starting NagarSetu Citizen Client...
start cmd /k "cd client && npm.cmd run dev"

echo Starting NagarSetu Admin Console...
start cmd /k "cd admin-panel && npm.cmd run dev"

echo All services are starting up!
echo - Client App will be on http://localhost:5173
echo - Admin Panel will be on http://localhost:5174
echo - Backend is on http://localhost:5000
