import json
from geopy.distance import great_circle
from operator import itemgetter

# if checkExplosionPosition(latitudeExplosion, longitudeExplosion) == False:
# 	print 'The explosion does not take place in Cluj county!'
# else:
# 	print calculateDistance("s10")

# verifies if the explosion was detected by the sensor
def checkDetection(sensors, sensorNumber, latitudeExplosion, longitudeExplosion, intensityExplosion):
    distance = great_circle((sensors[sensorNumber]["latitude"], sensors[sensorNumber]["longitude"]), (float(latitudeExplosion), float(longitudeExplosion))).meters
    # speed of sound 340.29 m/s
    secondsElapsed = distance / 340.29 / 10
    # intensity decreases with 2dB each 10 meters
    tousandsOfMeters = distance / 1000
    intensityDetected = intensityExplosion - (tousandsOfMeters * 2)
    return {
        "intensity": intensityDetected,
        "secondsElapsed": secondsElapsed
    }

def orderedSensors(sensors, lat, long, intensity):
    timeElapsedDictionary = {}
    for nr in sensors:
        d = checkDetection(sensors, nr, float(lat), float(long), intensity)
        timeElapsedDictionary[nr] = d

    timeOrdered = sorted(timeElapsedDictionary.items(), key=itemgetter(1, 1), reverse=True)
    normalizedTuple = []
    tupleLength = len(timeOrdered)
    normalizedTuple.append((timeOrdered[0][0], timeOrdered[0][1]['secondsElapsed'],  timeOrdered[0][1]['intensity']))
    for i in range (1, tupleLength):
        normalizedTuple.append((timeOrdered[i][0], timeOrdered[i][1]['secondsElapsed'] - timeOrdered[0][1]['secondsElapsed'], timeOrdered[i][1]['intensity']))

    return normalizedTuple