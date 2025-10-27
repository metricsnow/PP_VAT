@echo off
REM Launch PP_VAT GUI Application
REM Usage: launch_gui.bat

echo =========================================
echo   PP_VAT - GUI Application Launcher
echo =========================================
echo.

REM Activate virtual environment
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
    echo Virtual environment activated
) else (
    echo WARNING: Virtual environment not found
    echo Please run: python -m venv venv
    pause
    exit /b 1
)

echo.
echo Launching GUI...
echo.

REM Launch the GUI
python src\main_gui.py

pause

