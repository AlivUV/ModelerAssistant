import os
import json
import openai
import environ
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.exceptions import ImproperlyConfigured
import asyncio
from gemini_webapi import GeminiClient

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



async def geminiAux(prompt):
    client = GeminiClient(get_env("Secure_1PSID"), get_env("Secure_1PSIDTS"), proxy=None)
    await client.init(timeout=30, auto_close=False, close_delay=300)
    response = await client.generate_content(prompt)
    return response.text


@api_view(['POST'])
def gemini(request):
    body = json.loads(request.body.decode('utf-8'))
    response = asyncio.run(geminiAux(body["prompt"]))
    data = {
        'data': {
            'message': body['prompt'],
            'xml': response.split('```')[1][5:]
        }
    }
    return Response(data, status = status.HTTP_200_OK)
