@echo off
FOR /F "delims=" %%i IN ('powershell -Command Get-Date -Format yyyy-MM-ddThhmmss') DO SET tms=%%i
set cdir=%~dp0%
set pth=%cdir%log
if not exist %pth% mkdir %pth%
powershell -ExecutionPolicy RemoteSigned -File klerede-import.ps1 2>&1 >> %pth%\%tms%.log
