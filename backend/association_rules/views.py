from rest_framework.decorators import api_view
from rest_framework.response import Response
from .Apriori import Apriori


@api_view(['GET'])
def get(request, key):
    res = Apriori().recommended(key)
    return Response({"recommendations": res})


@api_view(['POST'])
def post(request):
    res = Apriori().add(request)
    return Response({"success": res})
