# ExplosionDetectionApplication

The project is a distributed web application implemented using the popular Python framework, called Flask. The developed software has the purpose of detecting the approximate area of an explosion that might happen in Cluj county (Romania), using an array of 30 sound detection sensors. 

### Installation

The project can be started from the command prompt or using an IDE, after installing some necessary Python libraries: *Flask*, *eventlet*, *flask-socketio* and *zmq*. The dependencies can be installed using *pip*:

```sh
$ pip install <package_name>
```

The Python *microframework* offers a flexible environment for both the back end and front end development. The needed JavaScript libraries are loaded locally, so the user will get them once the project is downloaded. They also can accessed from a public CDN. The necessary libraries are: *socketio*, *jQuery*, *jQueryUI*, *Moment.JS* and a nice notification functionality was used that can be found [here](http://tympanus.net/codrops/2014/07/23/notification-styles-inspiration/).

Then, the application can be started:

```sh
$ python project.py
```

### Flow

When the server is properly running the user has to see the GUI from *Figure 1*:

<p align="center">
  <img src="https://github.com/ghele/ExplosionDetectionApplication/blob/master/captures/GUI.PNG" align="middle"></img>
</p>
*<p align="center">Figure 1. GUI</p>*

The user can start the simulation by introducing an explosion intensity of minimum 120 dB and by placing the explosion on the supervised area by pressing in the same time CTRL button and left click.
If the introduced intensity is lower than the threshold value or the explosion is placed outside the area supervised by the sensors, the simulation will not start, the user being notified with the proper mesages. Also, if the explosion is placed on a sensor, the user gets a message containing the id of the damaged sensor.
The top-left mini-monitor from the GUI provides to the user different information related to the state of the explosion simulation:
the bidimensional coordinates of the explosion, the intensities and moments with/when each sensor was notified and the order the sensors detected the explosion. The messages/notifications containing these data are sent from the explosion (server) to the sensors (client) using the messaging library called ZerMQ.
A sensor is notified if it detects a sound intensity higher or equal to 80 dB. In this case, the specific sensor becomes red. When a minimum number of four sensors detects the explosion, the process of determination of the possible area begins. In the moment that the button from the GUI becomes active, the approximate position of the catastrophe was determined and can be seen by "pressing" (clicking on) it, as <br/> in *Figure 2*:

<p align="center">
  <img src="https://github.com/ghele/ExplosionDetectionApplication/blob/master/captures/explosion-detection.PNG"/>
</p>
*<p align="center">Figure 2. Explosion position determination</p>*

### Position determination

The 30 sound detection sensors are placed such a way that each four are forming a square. The position of the explosion is determined based on the geometry of this rectangular form. 
The first four sensors that detect the explosion represent the square inside which the explosion took place. Based on the time differences between the moments that each of the four sensors was notified, four cases can be distinguished:

a.) if the time differences are approximately equal, then the explosion took place in the center of the square <br/>
b.) if two sensors detected the explosion approximately in the same time and after a considerable amount of time the other two sensors were notified, the explosion took place somewhere on one of the perpendiculars of the square <br/>
c.) if one sensor was notified first and then (after a considerable amount of time) other two sensors detected the explosion, the casualty took place somewhere on of the diagonals of the square <br/>
d.) if the data obtained indicates that we are not in any of the previous cases, the explosion happened in one of the four remaining "triangles"

Based on one of the previously mentioned situations, a radius with different size will appear around the first three notified sensors (the first sensors that detected the explosion). In order to obtain a better precision, the first three cases were divided in other three subcases each of them. Also, in order to cover a bigger area intervals (approximations, assumed errors) were used when the time differences were compared. 

### Conclusions

The results provided by the application are very good taking into consideration that the accuracy of the explosion detection is approximately 3.5 km.
The number and/or the positions of the sensors can be easily changed from the *sensors.json* file, emphasizing the scalability property of a distributed system.


