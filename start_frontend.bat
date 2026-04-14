@echo off
REM Inicia un servidor web local para el frontend
cd /d "%~dp0"
python -m http.server 3000
pause

REM Ejecuta esto para que el frontend pueda funcionar de maravilla los host despues 
REM estaran alojados en 
REM http://127.0.0.1:3000/index.html
REM http://127.0.0.1:3000/admin.html
REM http://127.0.0.1:3000/user.html