### Instructions to upgrade website

Run following commands:
1. Pull Changes - ```cd /sustaincred/website && git stash && git pull --rebase```
2. Restart Frontend - ```cd /sustaincred/website/frontend/ && npm run start```. Hit ```Ctrl + Z``` to suspend process. ```bg && disown```
3. Restart Backend - ```sudo systemctl daemon-reload && sudo systemctl restart gunicorn```
4. Restart Proxy Server if needed - ```sudo systemctl restart nginx```

### Accessing Admin pane

1. SSH to Linux server
2. Run command ```sudo vi /etc/nginx/nginx.conf```
3. Go to line 107, and allow only your IP address(Change or add ip address).
4. Restart nginx ```sudo systemctl restart nginx```
5. Access admin panel on URL - https://www.sustaincred.com/admin/

### Checking logs
* Check the Nginx process logs by typing: ```sudo journalctl -u nginx```
* Check the Nginx access logs by typing: ```sudo less /var/log/nginx/access.log```
* Check the Nginx error logs by typing: ```sudo less /var/log/nginx/error.log```
* Check the Gunicorn application logs by typing: ```sudo journalctl -u gunicorn``` . To go to the last lines in log files you need to press shift + G
* Check the Gunicorn socket logs by typing: ```sudo journalctl -u gunicorn.socket```

We have production mode enabled on Django. For clear logs swich to debug=true in prod.env config and restart server.(Note: Do not run server in debug mode for long time. Just use it for debugging only)