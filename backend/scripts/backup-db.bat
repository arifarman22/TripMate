@echo off
setlocal

set TIMESTAMP=%date:~-4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set BACKUP_DIR=backups
set BACKUP_FILE=%BACKUP_DIR%\tripmate_backup_%TIMESTAMP%.sql

if not exist %BACKUP_DIR% mkdir %BACKUP_DIR%

echo Creating database backup...

pg_dump %DATABASE_URL% > %BACKUP_FILE%

if %ERRORLEVEL% EQU 0 (
    echo Backup created successfully: %BACKUP_FILE%
) else (
    echo Backup failed!
    exit /b 1
)
