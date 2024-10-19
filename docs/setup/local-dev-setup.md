## Int sal local software
* Install npm, python, nginx in loca
* mysql optional because you can use sqlite for devo

## To run the frontend project
This project is used for creating user signup in Django, and Django Rest Framework by using OTP.
And limiting the OTP sending to 3 times. After 3rd OTP user can request a new OTP after an hour.
1.  **First Time** - Install node dependencis. ```npm run install```
1. Strt server using ```npm run start```
1. Visit the server link (http://localhost:3000/)

## To run the backend project
Run Server using below command
```cd backend; ./run.sh dev```
* Refer the local devo config on backend/dev.env folder

If you would like to statrt manually instead of run.sh, you can follow below steps.
1. **First Time** - Create a virtual environment (```python3 -m venv .venv```)
1. Activate the environment (```source .venv/bin/activate```)
1. **First Time** - Install all the packages (```pip install -r requirements.txt```)
1. **First Time (or) When UserModel changed** - Migrate (```python manage.py makemigrations && python manage.py migrate```)
1. **First Time** -Create a superuser (```python manage.py createsuperuser```). Fill in all the details on the terminal to create the superuser
1. Run the backend server (```python manage.py runserver```)
1. Visit the server link (http://localhost:8000/) if you want to access backend & http://localhost:8000/admin/ if you want control users.


## To run proxy Server(nginx)
If you are using Mac, 
* You can use home brew to install nginx ```brew install nginx``` 
* Paths of nginx ```/opt/homebrew/etc/nginx/nginx.conf```
* Restarting nginx server ```sudo nginx -s stop && sudo nginx```
* Running nginx as service ```brew services start mysql```
* Refer the nginx config on ```nginx/nginx.mac.cong```. Note: You need to appropriately updoate your backend workspace path


## References
https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication
https://stackoverflow.com/questions/43892289/cookie-value-is-undefined-react-cookie-2-0-6
https://stackoverflow.com/questions/72602627/detail-csrf-failed-csrf-token-missing-django-and-react
https://react-dropzone.js.org/#section-event-propagation
https://react-charts.tanstack.com/examples/simple
https://github.com/bendotcodes/cookies/tree/main/packages/react-cookie
