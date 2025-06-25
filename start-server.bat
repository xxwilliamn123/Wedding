@echo off
echo Starting local web server...
echo.
echo Your website will be available at:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
pause 