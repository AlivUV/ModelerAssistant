import os
import json
import openai
import environ
import requests
from bardapi import Bard
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.exceptions import ImproperlyConfigured


env = environ.Env()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

env.read_env()

def get_env(key, default=None):
    try:
        return env(key)
    except ImproperlyConfigured:
        return os.environ.get(key, default)


@api_view(['POST'])
def gpt(request):
    body = json.loads(request.body.decode('utf-8'))

    openai.api_key = get_env("OPENAI_API_KEY")

    print('=================================')
    print('=================================')
    print('=================================')
    print('=================================')

    print('gpt in progress')

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=body['messages']
    )

    print('=================================')
    print('=================================')
    print('=================================')
    print('=================================')

    if (completion.choices[0].message.content[0] != '{'):
        print('Split')
        completion.choices[0].message.content = completion.choices[0].message.content.split('```')[1][5:]

    data = {
        'data': {
            'message': body['messages'][-1]['content'],
            'xml': completion.choices[0].message.content
        }
    }
    return Response(data, status = status.HTTP_200_OK)


@api_view(['POST'])
def bard(request):

    print('=================================')
    print('=================================')
    print('=================================')
    print('=================================')

    print('bard in progress')

    body = json.loads(request.body.decode('utf-8'))

    token = get_env("BARD_API_KEY")

    input_text = """
        Proporciona el código XML sobre el diagrama BPMN de un proceso de inicio de sesión para una aplicación web.
        Por favor, proporciona la representación del proceso en formato BPMN XML 2.0 después de cerrar la etiqueta </definitions> incluye el xml correspondiente al diagrama '<bpmndi:BPMNDiagram>'.
    """

    session = requests.Session()
    session.headers = {
        "Host": "bard.google.com",
        "X-Same-Domain": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Origin": "https://bard.google.com",
        "Referer": "https://bard.google.com/",
    }
    session.cookies.set("__Secure-1PSID", token) 

    bard = Bard(token = token, session=session, timeout=30)

    bardXml = ""

    for i, val in enumerate(bard.get_answer(input_text)['content'].split('```')):
        if (i % 2 == 1):
            bardXml += val[3:]

    print('=================================')
    print('=================================')
    print('=================================')
    print('=================================')

    data = {
        'data': {
            'message': body['messages'][-1]['content'],
            'xml': bardXml
        }
    }

    return Response(data, status = status.HTTP_200_OK)