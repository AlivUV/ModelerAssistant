import os
import json
import openai
import environ
from rest_framework import status
from django.shortcuts import render
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
def autocomplete(request):
    body = json.loads(request.body.decode('utf-8'))
    xml = '''<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:uh="http://uh" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_0xcv3nk" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="3.0.0-dev">
  <bpmn:collaboration id="Collaboration_139m2ev">
    <bpmn:participant id="Participant_1he7wbr" name="User" processRef="Process_1" />
    <bpmn:participant id="Participant_App" name="Application" processRef="Process_App" />
  </bpmn:collaboration>
  
  <!-- User Process -->
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1">
      <bpmn:outgoing>Flow_09ar7od</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:Task id="Task_EnterCredentials" name="Enter Credentials" uh:priority="Medium" uh:points="2" uh:smart="false" uh:developer="User" uh:purpose="Provide login credentials." uh:dependencies="">
      <bpmn:incoming>Flow_09ar7od</bpmn:incoming>
      <bpmn:outgoing>Flow_UserToApp</bpmn:outgoing>
    </bpmn:Task>
    <bpmn:sequenceFlow id="Flow_09ar7od" sourceRef="StartEvent_1" targetRef="Task_EnterCredentials" />
    <bpmn:sequenceFlow id="Flow_UserToApp" sourceRef="Task_EnterCredentials" targetRef="Task_ProcessCredentials" />
  </bpmn:process>
  
  <!-- Application Process -->
  <bpmn:process id="Process_App" isExecutable="true">
    <bpmn:intermediateCatchEvent id="IntermediateEvent_Validate" name="Validate Credentials">
      <bpmn:incoming>Flow_UserToApp</bpmn:incoming>
      <bpmn:outgoing>Flow_Validated</bpmn:outgoing>
    </bpmn:intermediateCatchEvent>
    <bpmn:Task id="Task_ProcessCredentials" name="Process Credentials" uh:priority="High" uh:points="3" uh:smart="true" uh:developer="Application" uh:purpose="Validate and process provided credentials." uh:dependencies="">
      <bpmn:incoming>Flow_Validated</bpmn:incoming>
      <bpmn:outgoing>Flow_Processed</bpmn:outgoing>
    </bpmn:Task>
    <bpmn:sequenceFlow id="Flow_Validated" sourceRef="IntermediateEvent_Validate" targetRef="Task_ProcessCredentials" />
    <bpmn:sequenceFlow id="Flow_Processed" sourceRef="Task_ProcessCredentials" targetRef="EndEvent_App" />
    <bpmn:endEvent id="EndEvent_App" name="End Application Process">
      <bpmn:incoming>Flow_Processed</bpmn:incoming>
    </bpmn:endEvent>
  </bpmn:process>
  
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_139m2ev">
      <bpmndi:BPMNShape id="Participant_User_di" bpmnElement="Participant_1he7wbr" isHorizontal="true">
        <dc:Bounds x="140" y="80" width="901" height="250" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Participant_App_di" bpmnElement="Participant_App" isHorizontal="true">
        <dc:Bounds x="140" y="350" width="901" height="250" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_09ar7od_di" bpmnElement="Flow_09ar7od">
        <di:waypoint x="226" y="205" />
        <di:waypoint x="321" y="205" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_UserToApp_di" bpmnElement="Flow_UserToApp">
        <di:waypoint x="421" y="205" />
        <di:waypoint x="521" y="205" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Validated_di" bpmnElement="Flow_Validated">
        <di:waypoint x="621" y="355" />
        <di:waypoint x="721" y="355" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Processed_di" bpmnElement="Flow_Processed">
        <di:waypoint x="821" y="455" />
        <di:waypoint x="900" y="455" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="190" y="187" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1da8bxc_di" bpmnElement="Task_EnterCredentials">
        <dc:Bounds x="321" y="165" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_ProcessCredentials_di" bpmnElement="Task_ProcessCredentials">
        <dc:Bounds x="721" y="355" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="IntermediateEvent_Validate_di" bpmnElement="IntermediateEvent_Validate">
        <dc:Bounds x="621" y="335" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_App_di" bpmnElement="EndEvent_App">
        <dc:Bounds x="900" y="435" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>'''

    openai.api_key = get_env("OPENAI_API_KEY")

    print('=================================')
    print('=================================')
    print('=================================')
    print('=================================')

    print('openai.api_key')

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": body['prompt']}
        ]
    )

    print('=================================')
    print('=================================')
    print('=================================')
    print('=================================')

    data = {
      'data': {
        'message': body['prompt'],
        'xml': completion.choices[0].message.content
      }
    }
    return Response(data, status = status.HTTP_200_OK)