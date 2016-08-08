import os
import json
import eventlet
import time
from threading import Thread
import sys
from flask import Flask, render_template, jsonify
from flask.ext.socketio import SocketIO, emit
# from sensor import *
import socketio
import zmq
import time
from helpers import *

app = Flask(__name__)
sio = SocketIO(app=app, async_mode="threading")

explosion_thread = None
sensors = None

# ZeroMQ Publisher Context
serverContext = zmq.Context()
serverSock = serverContext.socket(zmq.PUB)
serverSock.bind("tcp://127.0.0.1:5680")

@app.route('/')
def index():


    return render_template('index.html')

@app.route('/getSensors')
def sensors():
    return jsonify(sensors)

@sio.on('trigger', namespace='/socket')
def test_message(message):
    # stop thread if already running
    if explosion_thread is not None:
        explosion_thread.stop()

    # start thread to publish notifications for sensors
    thread = Thread(target=explosion_simulation, kwargs={'lat':message['lat'], 'long':message['long'], 'intensity': message['intensity']})
    thread.start()

    print("explosion on", message['lat'], message['long'], message['intensity'])

@sio.on('connect', namespace='/socket')
def test_connect():
    emit('notification', {'data': 'Connected'})

def explosion_simulation(lat=0, long=0, intensity=0):
    notificationOrder = orderedSensors(sensors, float(lat), float(long), intensity)
    print(notificationOrder)

    for i in range(0, len(notificationOrder)):
        time.sleep(notificationOrder[i][1])
        # Message [prefix][message]
        message = "{sensor} {intensity} ".format(sensor=notificationOrder[i][0], intensity=notificationOrder[i][2])
        print("Sending message to sensor: " + message)
        serverSock.send(message)

def sensor_thread(number="", name=""):
    print('Sensor ' + number + '(' + name + ') started')
    clientContext = zmq.Context()
    clientSock = clientContext.socket(zmq.SUB)
    clientSock.setsockopt_string(zmq.SUBSCRIBE, number)
    clientSock.connect("tcp://127.0.0.1:5680")
    while True:
        message=clientSock.recv()
        sio.emit('notification', {"explosion": message}, namespace='/socket')
        print(message)

if __name__ == '__main__':
    # load JSON file containing the latitudinal and longitudinal coordinatates of each sensor
    with open(os.path.join(sys.path[0], "sensors.json"), "r") as data_file:
        sensors = json.load(data_file)

    # start sensors
    for nr in sensors:
        t = Thread(target=sensor_thread, kwargs={'number':nr, 'name':sensors[nr]['label']})
        t.daemon = True
        t.start()

    sio.run(app=app)