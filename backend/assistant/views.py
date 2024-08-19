import os
import json
import asyncio
import environ
from openai import OpenAI
from rest_framework import status
import google.generativeai as genai
from gemini_webapi import GeminiClient
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.exceptions import ImproperlyConfigured

env = environ.Env()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

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

    openai = OpenAI(api_key=get_env("OPENAI_API_KEY"))

    completion = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=body['messages']
    )

    if (completion.choices[0].message.content[0] != '{'):
        print('Split')
        xml = completion.choices[0].message.content.split('```')[1][5:]
    else:
        xml = completion.choices[0].message.content

    data = {
        'data': {
            'usage': {
                'total': completion.usage.total_tokens,
                'prompt': completion.usage.prompt_tokens,
                'completion': completion.usage.completion_tokens
            },
            'message': body['messages'][-1]['content'],
            'xml': xml,
            'response': completion.choices[0].message.content
        }
    }
    return Response(data, status = status.HTTP_200_OK)


@api_view(['POST'])
def gptTunned(request):
    """Función para realizar peticiones al modelo de lenguaje gpt-3.5 afinado.
    ---
    post: Función para realizar peticiones al modelo de lenguaje gpt-3.5 afinado.
    responses:
        200: El modelo respondió exitosamente.
    """
    body = json.loads(request.body.decode('utf-8'))

    openai = OpenAI(api_key=get_env("OPENAI_API_KEY"))

    completion = openai.chat.completions.create(
        model="ft:gpt-3.5-turbo-0125:personal::9A7kZudv",
        messages=body['messages']
    )

    if (completion.choices[0].message.content[0] != '{'):
        print('Split')
        completion.choices[0].message.content = completion.choices[0].message.content.split('```')[1][5:]

    data = {
        'data': {
            'usage': {
                'total': completion.usage.total_tokens,
                'prompt': completion.usage.prompt_tokens,
                'completion': completion.usage.completion_tokens
            },
            'message': body['messages'][-1]['content'],
            'xml': completion.choices[0].message.content
        }
    }
    return Response(data, status = status.HTTP_200_OK)


@api_view(['POST'])
def geminiPro(request):
    body = json.loads(request.body.decode('utf-8'))

    genai.configure(api_key = get_env("GEMINI_API_KEY"))

    model = genai.GenerativeModel('gemini-pro')

    response = model.generate_content(body['messages'])

    xml = response.text.split('```')

    if (len(xml) > 1) :
        xml = xml[1]
    else:
        xml = response.text

    if (xml[0] != '{' and xml[0] != '\n'):
        xml = xml[5:]

    data = {
        'data': {
            'usage': {
                'total': len(body['messages'][-1]['parts']) + len(response.text),
                'prompt': len(body['messages'][-1]['parts']),
                'completion': len(response.text)
            },
            'message': body['messages'][-1]['parts'],
            'xml': xml,
            'response': response.text
        }
    }
    return Response(data, status = status.HTTP_200_OK)


async def geminiAux(prompt):
    client = GeminiClient(get_env("Secure_1PSID"), get_env("Secure_1PSIDTS"), proxy=None)
    await client.init(timeout=30, auto_close=False, close_delay=300)
    response = await client.generate_content(prompt)
    print(response.text)
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
