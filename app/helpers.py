import json
import math
from operator import itemgetter

# verifies if the explosion was detected by the sensor
def checkDetection(sensors, sensorNumber, xExplosion, yExplosion, intensityExplosion):
    # distance in pixels
    # height and width of Cluj county is approximately equal to 120km, while the background image's dimensions are approximately 660px X 660px
    # 1m = 0.0055px, speed of sound = 340.29 m/s
    # speed = 1.87px/s
    # intensity decreases with 2dB each 10 pixels

    distance = math.sqrt(math.pow((sensors[sensorNumber]["x-axis"] - xExplosion), 2) + math.pow((sensors[sensorNumber]["y-axis"] - yExplosion), 2) );
    print "The distance is ", sensors[sensorNumber], distance
    # for real time
    # secondsElapsed = distance / 1.87;
    secondsElapsed = distance / 1.87 / 10;
    tenthOfPixels = float(distance / 10)
    intensityDetected = intensityExplosion - (tenthOfPixels * 2)

    return {
        "intensity": intensityDetected,
        "secondsElapsed": secondsElapsed
    }

def orderedSensors(sensors, x, y, intensity):
    timeElapsedDictionary = {}
    for nr in sensors:
        d = checkDetection(sensors, nr, float(x), float(y), intensity)
        timeElapsedDictionary[nr] = d

    timeOrdered = sorted(timeElapsedDictionary.items(), key=itemgetter(1, 1), reverse=True)
    normalizedTuple = []
    tupleLength = len(timeOrdered)
    normalizedTuple.append((timeOrdered[0][0], timeOrdered[0][1]['secondsElapsed'],  timeOrdered[0][1]['intensity']))
    for i in range (1, tupleLength):
        normalizedTuple.append((timeOrdered[i][0], timeOrdered[i][1]['secondsElapsed'] - timeOrdered[i - 1][1]['secondsElapsed'], timeOrdered[i][1]['intensity']))

    return normalizedTuple
