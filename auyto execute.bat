@echo off
title ejecutando 
mode con: cols=100 lines=10
color a



:1
cls
node index.js
color a
timeout /t 10 /nobreak
goto 1