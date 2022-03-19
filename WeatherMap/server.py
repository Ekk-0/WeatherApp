from datetime import datetime, timedelta
import json
from logging import exception
import requests
from flask import Flask, request, Response
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
@app.route('/', methods=['POST']) # USED TO RECIEVE POST REQUESTS
@cross_origin(origin='*')
def my_main_function(): # THE MAIN FUNCTION
    #----------------------------------------------------------------
    try:
        coordinates = request.get_json()
        weatherinfo = getweather(coordinates)
        return Response(json.dumps(weatherinfo), mimetype="application/json")
    except exception as e:
        print(e)
def getweather(coordinates):
    lat = str(coordinates.get('lat'))
    lng = str(coordinates.get('lng'))
    loc = lat + "," + lng
    start = datetime.now()
    end = datetime.now() + timedelta(hours=11)
    #----------------------------------------------------------------    
    querystring = {
        "location": loc,
        "fields":["temperature", "cloudCover", "windSpeed", "windDirection"],
        "units":"metric",
        "timesteps":"1h",
        "startTime": (str(start).strip()+"Z"),
        "endTime": (str(end).strip()+"Z"),
        "apikey":"kyVCN0eGDO9xXDRoIP7X3f8OuEWCixoV"
    }
    #----------------------------------------------------------------
    url = "https://api.tomorrow.io/v4/timelines"   
    response = requests.request("GET", url, params=querystring)
    weatherinfo = json.loads(response.text)
    return weatherinfo