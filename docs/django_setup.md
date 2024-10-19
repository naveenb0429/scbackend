#install Python 
sudo apt update
sudo apt install python3                    

#install Virtual env
sudo apt install python3-venv

#create vitual env
python3 -m venv venv

#activate virtual env
source venv/bin/activate

#install the requirement
pip install -r requirements.txt

#makemigrations
python manage.py makemigrations
python manage.py migrate

#create superuser 
python manage.py createsuperuser

(if above cmd not able to create User table then delete database and migrations file 
rm db.sqlite3
rm -rf migrations/*
python manage.py makemigrations accounts
python manage.py migrate
python manage.py createsuperuser
)


#run the project 
source venv/bin/activate
./run.sh dev