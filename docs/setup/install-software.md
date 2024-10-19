## Mysql

### Remove MySQL:
First, remove the existing MySQL installation. This command will remove MySQL but preserve the configuration files:

```bash
sudo apt-get remove --purge mysql-server mysql-client mysql-common mysql-server-core-* mysql-client-core-*
```
Additionally, you can remove the MySQL configuration files:

```bash
sudo rm -rf /etc/mysql /var/lib/mysql
```

### Clean Up Dependencies:
Clean up any dependencies that are no longer needed:

```bash
sudo apt-get autoremove
sudo apt-get autoclean
```

### Install MySQL:
Install MySQL again using the following commands:

```bash
sudo apt-get update
sudo apt-get install mysql-server
```
During the installation, you may be prompted to set a root password for MySQL. If not, you can set it later using:

```bash
sudo mysql_secure_installation
```
Follow the on-screen instructions to configure MySQL security options.

### Start MySQL:
Start the MySQL service:

```bash
sudo systemctl start mysql
```

Setting up password
```shell
CREATE USER 'sustaincred'@'localhost' IDENTIFIED BY 'Password';
GRANT ALL PRIVILEGES ON * . * TO 'sustaincred'@'localhost';
FLUSH PRIVILEGES;

```

### Enable MySQL to start on boot:

```bash
sudo systemctl enable mysql
```

### Check MySQL Status:
Verify that MySQL is running:

```bash
sudo systemctl status mysql
```
Ensure that there are no errors in the status output.

### Test MySQL:
Connect to MySQL and test if you can run queries:

```bash
sudo mysql -u root -p
```
Enter the root password when prompted. Once logged in, create database required by website:

```sql
create database sustaincred;

```
Exit the MySQL shell:
```
sql
EXIT;
```

### Install required software to run mysql client

```bash
sudo apt install build-essential
sudo apt install libmysqlclient-dev
sudo apt install python3-dev
```

```vi ~/.bashrc``` & Add below lines.
```shell
export MYSQLCLIENT_CFLAGS="-I/usr/include/mysql"
export MYSQLCLIENT_LDFLAGS="-L/usr/lib/x86_64-linux-gnu -lmysqlclient"
```

## Nginx

### Install Nginx:
Use the following command to install Nginx.

```bash
sudo apt install nginx
sudo apt install certbot
```
During the installation, you might be asked to confirm the download size. Type 'Y' and press Enter to proceed.

### Start Nginx:
After the installation is complete, start the Nginx service.

```bash
sudo systemctl start nginx
```

### Enable Nginx to Start on Boot:

To ensure that Nginx starts automatically when your server boots, run:

```bash
sudo systemctl enable nginx
```

### Check Nginx Status:
Confirm that Nginx is running without errors.

```bash
sudo systemctl status nginx
```

You should see an output indicating that Nginx is active and running.

### Nginx config
Refer the config in nginx.server.conf
```bash
sudo vi /etc/nginx/nginx.conf
```

## NPM/nodeJS
Install the software
```bash
sudo apt-get install nodejs
sudo apt-get install npm
```

### Setting up gunicorn
https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-22-04

#### Useful commands

sudo systemctl stop gunicorn.socket
sudo systemctl disable gunicorn.socket
sudo systemctl start gunicorn.socket
sudo systemctl enable gunicorn.socket


sudo systemctl daemon-reload
sudo systemctl restart gunicorn
