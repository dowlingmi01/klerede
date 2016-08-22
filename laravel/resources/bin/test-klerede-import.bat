@echo off
set cdir=%~dp0%
powershell -ExecutionPolicy Unrestricted -File %cdir%klerede-import.ps1 -test
