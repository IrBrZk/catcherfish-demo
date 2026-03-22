#!/bin/bash
# Добавляет задачу в cron — запуск каждые 15 минут
(crontab -l 2>/dev/null; echo "*/15 * * * * /usr/bin/python3 $(pwd)/sync_wb.py >> $(pwd)/sync.log 2>&1") | crontab -
echo "Cron настроен"
