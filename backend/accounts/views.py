import datetime
import random
from datetime import timedelta 
# noinspection PyUnresolvedReferences
from accounts.utils import send_email_otp, generate_random_string
from django.conf import settings
from django.contrib.auth import login
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from knox import views as knox_views
from knox.auth import TokenAuthentication
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from knox.models import AuthToken
from .models import UserProfile
from .serializers import CreateUserSerializer, UpdateUserSerializer, LoginSerializer, ChangePasswordSerializer
from .utils import send_email_reset
# from .utils import generate_login_link,send_login_link
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.cache import cache
from django.http import JsonResponse
from rest_framework.authtoken.models import Token 

class CreateUserAPI(CreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = CreateUserSerializer
    permission_classes = (AllowAny,)


@csrf_exempt
@api_view(['POST'])
# def verify_otp(request):
#     user = get_object_or_404(UserProfile, email=request.data.get("email"))
#     if (not user.is_active
#             and user.otp == request.data.get("otp")
#             and user.otp_expiry
#             and timezone.now() < user.otp_expiry):
#         user.is_active = True
#         user.otp_expiry = None
#         user.max_otp_try = settings.MAX_OTP_TRY
#         user.otp_max_out = None
#         user.save()

#         # _, token = AuthToken.objects.create(user)
#         # uid = urlsafe_base64_encode(force_bytes(user.pk))

#         # one_time_token = get_random_string(length=32)
#         # token_expires_at = timezone.now() + timedelta(hours=1)
#         # cache.set(one_time_token, user.id, timeout=3600)
#         # login_link =  f'{settings.FRONTEND_URL}/login?token={one_time_token}'

#         # send_mail(
#         #     'Login Link',
#         #     f'Click the link to login: {login_link}',
#         #     settings.EMAIL_HOST_USER,
#         #     [user.email],
#         #     fail_silently=False,
#         # )
        
#         return Response(
#             "Successfully verified the user.", status=status.HTTP_200_OK
#         )
#     return Response({"otp": "Failed to verify OTP"}, status=status.HTTP_400_BAD_REQUEST)
def verify_otp(request):
    email = request.data.get("email")
    otp = request.data.get("otp")

    # Debugging info
    print(f"Email received: {email}")
    print(f"OTP received: {otp}")

    user = get_object_or_404(UserProfile, email=email)
    
    # Debugging info
    print(f"User OTP: {user.otp}")
    print(f"User OTP Expiry: {user.otp_expiry}")
    print(f"Current Time: {timezone.now()}")
    print("session Id", request.session.get('session_key'))

    if (not user.is_active
            and user.otp == otp
            and user.otp_expiry
            and timezone.now() < user.otp_expiry):
        user.is_active = True
        user.otp_expiry = None
        user.max_otp_try = settings.MAX_OTP_TRY
        user.otp_max_out = None
        user.save()

        # Log in the user (Use request._request to convert)
        login(request._request, user)

        # Generate an AuthToken for the user using Knox
        token = Token.objects.create(user=user)

        expiration_time = timezone.now() + timedelta(hours=1)  # Token valid for 1 hour

        # Store the token and its expiration time in the session
        request.session['token_expiration'] = expiration_time.isoformat()
        request.session['user_id'] = user.id
        request.session.save()

        print(f"Token stored in session: {token.key}")
        print(f"User ID stored in session: {user.id}")
        login_link = f'localhost:8000/accounts/login-with-token/?token={token.key}'
        # login_link = f'{settings.FRONTEND_URL}/login?token={token.key}'

        # Send the login link via email
        send_mail(
            'Login Link',
            f'Click the link to login: {login_link}',
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )
        
        return Response(
            "Successfully verified the user. A login link has been sent to your email.", status=status.HTTP_200_OK
        )
    
    return Response({"otp": "Failed to verify OTP"}, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET'])
# @csrf_exempt
# def login_with_token(request):
#     token = request.GET.get('token')
#     print(token)
    
#     if not token:
#         return JsonResponse({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

#     # Retrieve the token object based on the provided key
#     try:
#         session_token = Token.objects.get(key=token)
#         user = session_token.user  # Get the associated user from the token
#     except Token.DoesNotExist:
#         return JsonResponse({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)

#     print(f"User associated with token: {user}")

#     # Log in the user
#     login(request, user)

#     # Check if the user already has a token and delete it
#     Token.objects.filter(user=user).delete()  # This prevents UNIQUE constraint error

#     # Generate a new AuthToken for the user using Knox (if you're using Knox)
#     auth_token = AuthToken.objects.create(user=user)
#     print(auth_token)

    

#     return JsonResponse({'token': str(auth_token)}, status=status.HTTP_200_OK)


class LoginWithTokenView(knox_views.LoginView):
    permission_classes = [AllowAny]  # Allow anyone to access this view
    
    def get(self, request, *args, **kwargs):
        token = request.GET.get('token')
        print(f"Received token: {token}")
        
        if not token:
            print("No token provided.")
            return JsonResponse({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the token object based on the provided key
        
        
        try:
            session_token = Token.objects.get(key=token)
            user = session_token.user  # Get the associated user from the token
            print(f"Token found. User associated with token: {user}")
        except Token.DoesNotExist:
            print("Token does not exist or has expired.")
            return JsonResponse({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
    
        # Log in the user
        login(request, user)
        print(f"User {user} logged in successfully.")

        # Check if the user already has a Knox token and delete it
        AuthToken.objects.filter(user=user).delete()  # Delete existing Knox tokens

        # Generate a new AuthToken for the user using Knox
        auth_token = AuthToken.objects.create(user=user)
        print(f"Generated new Knox token: {auth_token} for user {user}")
        share_token = str(auth_token[0]).split(':')
        
        user_info ={
            'user_id': user.id,
            'email': user.email,
            'first_name':user.first_name
        }

        return JsonResponse({'user':user_info,'token':str(share_token[0]) }, status=status.HTTP_200_OK)























@csrf_exempt
@api_view(['POST'])
def regenerate_otp(request):
    user = get_object_or_404(UserProfile, email=request.data.get("email"))
    if int(user.max_otp_try) == 0 and timezone.now() < user.otp_max_out:
        return Response(
            "Max OTP try reached, try after an hour",
            status=status.HTTP_400_BAD_REQUEST,
        )

    otp = random.randint(1000, 9999)
    otp_expiry = timezone.now() + datetime.timedelta(minutes=2, seconds=30)
    max_otp_try = int(user.max_otp_try) - 1

    user.otp = otp
    user.otp_expiry = otp_expiry
    user.max_otp_try = max_otp_try
    if max_otp_try == 0:
        otp_max_out = timezone.now() + datetime.timedelta(hours=1)
        user.otp_max_out = otp_max_out
    elif max_otp_try == -1:
        user.max_otp_try = settings.MAX_OTP_TRY
    else:
        user.otp_max_out = None
        user.max_otp_try = max_otp_try
    user.save()
    send_email_otp(user.email, otp)
    return Response("Successfully generate new OTP.", status=status.HTTP_200_OK)


class ResendVerificationAPI(CreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = CreateUserSerializer
    permission_classes = (AllowAny,)


class UpdateUserAPI(UpdateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UpdateUserSerializer


class ResetPasswordAPI(knox_views.APIView):
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        user = get_object_or_404(UserProfile, email=request.data.get("email"))
        otp_expiry = timezone.now() + datetime.timedelta(minutes=2, seconds=30)
        temporary_password = generate_random_string();
        user.temporary_password = temporary_password
        user.otp_expiry = otp_expiry
        user.save()
        send_email_reset(request.data.get("email"), temporary_password)
        return Response({'detail': 'Reset email sent successfully.'}, status=status.HTTP_200_OK)


class ChangePasswordAPI(knox_views.APIView):
    authentication_classes = (TokenAuthentication,)

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if serializer.validated_data['reset']:
                if user.temporary_password != old_password or timezone.now() > user.otp_expiry:
                    return Response({'detail': 'Incorrect or Expired Credentials.'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                if not user.check_password(old_password):
                    return Response({'detail': 'Old password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()

            request.user.auth_token_set.all().delete()
            return Response({'detail': 'Password changed successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(knox_views.LoginView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            login(request, user)
            response = super().post(request, format=None)
        else:
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response(response.data, status=status.HTTP_200_OK)  
    







