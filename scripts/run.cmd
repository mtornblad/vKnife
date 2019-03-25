@echo off

echo.
echo ---Pushing project to Google Apps Script
echo.
cmd /c clasp push

echo.
echo ---Running function test
echo.
cmd /c clasp run test
