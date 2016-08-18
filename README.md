# ExplosionDetectionApplication

The project is a web application implemented using the popular Python framework, called Flask. The developed software has the purpose of detecting the approximate area of an explosion that might happen in Cluj county (Romania), using an array of 30 sound detection sensors. 

### Installation

The project can be started from the command prompt or using an IDE, after installing some necessary Python libraries: *Flask*, *eventlet*, *socketio* and *zmq*. The dependencies can be installed using *pip*:

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



The user can start the simulation by introducing an explosion intensity of minimum 120 dB and by placing the explosion on the supervised area by pressing in the same time CTRL button and left click.
If the introduced intensity is lower than the threshold value or the explosion is placed outside the area supervised by the sensors, the simulation will not start, the user being notified with the proper mesages. Also, if the explosion is placed on a sensor, the user gets a message containing the id of the damaged sensor.
The top-left mini-monitor from the GUI provides to the user different information related to the state of the explosion simulation:
the bidimensional coordinates of the explosion, the intensities and moments with/when each sensor was notified and the order the sensors detected the explosion.
A sensor is notified if it detects a sound intensity higher or equal to 80 dB. In this case the specific sensor becomes red. When a minimum number of four sensors detects the explosion, the process of determination of the possible area begins. In the moment that the button from the GUI becomes active, the approximate position of the catastrophe was determined and can be seen by "pressing" (clicking on) it, as in *Figure 2*:

### Position determination

### Conclusions

