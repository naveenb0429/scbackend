# noinspection PyUnresolvedReferences
from accounts.utils import send_enquiry
from knox import views as knox_views
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import EnquirySerializer, NewsLetterSerializer


class SubmitEnquiry(knox_views.APIView):
    permission_classes = (AllowAny,)
    serializer_class = EnquirySerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid(raise_exception=True):
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        send_enquiry(request.data)
        return Response({}, status=status.HTTP_200_OK)


class NewsLetter(knox_views.APIView):
    permission_classes = (AllowAny,)
    serializer_class = NewsLetterSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid(raise_exception=True):
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer.save()
            return Response({}, status=status.HTTP_200_OK)
