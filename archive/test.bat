@echo off
REM FastAPI Migration Testing Script for Windows
REM This script provides easy testing commands for Windows users

echo ========================================
echo NiftyTools FastAPI Migration Testing
echo ========================================
echo.

if "%1"=="" goto :menu
if "%1"=="start" goto :start
if "%1"=="stop" goto :stop
if "%1"=="validate" goto :validate
if "%1"=="compare" goto :compare
if "%1"=="load" goto :load
if "%1"=="help" goto :help

:menu
echo Available commands:
echo   start     - Start testing environment with both backends
echo   stop      - Stop testing environment
echo   validate  - Run API contract validation
echo   compare   - Run performance comparison
echo   load      - Run load testing
echo   help      - Show this help
echo.
echo Usage: test.bat [command]
echo.
goto :end

:start
echo Starting testing environment...
docker-compose -f docker-compose.test.yml down 2>nul
docker-compose -f docker-compose.test.yml up -d --build
echo.
echo Waiting for services to start...
timeout /t 20 /nobreak >nul
echo.
echo Checking service health...
echo.
echo Gateway:
curl -s http://localhost:3000/health 2>nul || echo Gateway not ready
echo.
echo Node.js Backend:
curl -s http://localhost:3001/health 2>nul || echo Node.js backend not ready
echo.
echo Python Backend:
curl -s http://localhost:3002/health 2>nul || echo Python backend not ready
echo.
echo Testing environment started!
echo Frontend: http://localhost:8080
echo Gateway:  http://localhost:3000
echo.
goto :end

:stop
echo Stopping testing environment...
docker-compose -f docker-compose.test.yml down
echo Testing environment stopped.
echo.
goto :end

:validate
echo Running API contract validation...
echo.
node scripts/validate-api-contract.js
echo.
goto :end

:compare
echo Running performance comparison...
echo.
node scripts/test-backends.js
echo.
goto :end

:load
echo Running load testing...
echo.
node scripts/load-test.js
echo.
goto :end

:help
echo FastAPI Migration Testing Commands
echo ==================================
echo.
echo start     - Start both Node.js and Python backends for testing
echo stop      - Stop all testing services
echo validate  - Verify API compatibility between backends
echo compare   - Compare performance metrics
echo load      - Test concurrent request handling
echo.
echo Quick Start:
echo   test.bat start
echo   test.bat validate
echo   test.bat compare
echo.
echo Service URLs:
echo   Frontend:        http://localhost:8080
echo   Gateway:         http://localhost:3000
echo   Node.js API:     http://localhost:3001
echo   Python API:      http://localhost:3002
echo.
goto :end

:end
echo Done.
