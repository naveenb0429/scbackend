import requests
from django.conf import settings
from django.core.mail import send_mail
import secrets
import string
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator

def send_otp(mobile, otp):
    url = f"https://2factor.in/API/V1/{settings.SMS_API_KEY}/SMS/{mobile}/{otp}/Your OTP is"
    payload = ""
    headers = {'content-type': 'application/x-www-form-urlencoded'}
    response = requests.get(url, data=payload, headers=headers)
    return bool(response.ok)


def generate_random_string(length=8):
    characters = string.ascii_letters + string.digits
    random_string = ''.join(secrets.choice(characters) for _ in range(length))
    return random_string


def send_email_otp(email, otp):
    print("email")
    send_mail(subject="OTP for SustainCred",
              message="Greetings from sustaincred.com!!\n\n" +
                      "OTP for completing signup is - " + str(otp) + "\n" +
                      "This OTP is valid only for 2 minutes 30 second. Please provide this OTP for completing registration.\n" +
                      "You are receiving this email for signing up for sustaincred.com. " +
                      "Please do not share this OTP with anybody.\n\n" +
                      "This is a system generated mail. Please don't reply.",
              from_email=settings.EMAIL_HOST_USER,
              recipient_list=[email])
              
    return True

def send_email_reset(email, password):
    send_mail(subject="Paasword Reset for SustainCred",
              message="Greetings from sustaincred.com!!\n\n" +
                      "Your temporary password for login is\n " + str(password) + "\n" +
                      "This password is valid only for 2 minutes 30 second. Please provide this password for signing in.\n"
                      "Make sure to change the password with in 2 minutes 30 second of signin.\n" +
                      "You are receiving this email for resetting password on sustaincred.com. " +
                      "Please do not share this password with anybody.\n\n" +
                      "This is a system generated mail. Please don't reply.",
              from_email=settings.EMAIL_HOST_USER,
              recipient_list=[email])
    return True


def send_enquiry(formData):
    email = settings.EMAIL_HOST_USER
    send_mail(subject="Need the demo for the product",
              message="Here are my details.\n"
                      "\nCompany Name: " + str(formData['companyName']) +
                      "\nFirst Name: " + str(formData['firstName']) +
                      "\nLast Name: " + str(formData['lastName']) +
                      "\nEmail: " + str(formData['email']) +
                      "\nPhone Number: " + str(formData['phoneNumber']) +
                      "\nEnquiry: " + str(formData['enquiry']),
              from_email=settings.EMAIL_HOST_USER,
              recipient_list=[email])
    return True



def generate_login_link(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    login_link = reverse('login')  # Replace 'login' with your login URL name
    return f"{settings.FRONTEND_URL}{login_link}?uid={uid}&token={token}"

def send_login_link(email, login_link):
    subject = "Your Login Link"
    message = f"Click the link below to log in:\n\n{login_link}"
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])