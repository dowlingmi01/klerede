@echo off
FOR /F "delims=" %%i IN ('powershell -Command Get-Date -Format yyyy-MM-ddTHHmmss') DO SET tms=%%i
set cdir=%~dp0%
set pth=%cdir%log
if not exist %pth% mkdir %pth%
cd %cdir%
powershell -ExecutionPolicy Unrestricted -File %cdir%klerede-import.ps1 2>&1 >> %pth%\%tms%.log
