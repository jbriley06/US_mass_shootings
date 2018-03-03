# Dependencies
import pymongo
import datetime
import os
from collections import defaultdict
from flask import Flask, render_template, jsonify, Markup
from operator import itemgetter
from bs4 import BeautifulSoup
import requests

MONGODB_URI = os.environ.get('MONGODB_URI')
if not MONGODB_URI:
   MONGODB_URI = "mongodb://localhost:27017/us_mass_shootings"

conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)

db = client.us_mass_shootings
collection = db.incidents
shootings = db.shootings

app = Flask(__name__)
@app.route("/")
def plots():
    return render_template("index.html")

@app.route("/plots")
def shootingsperyear():
    return render_template("shootingsperyear.html")


@app.route("/choropleth")
def gunlaws():
    return render_template("choropleth.html")

@app.route("/incidents_per_year")
def index():
    events = list(shootings.find())

    year_list = []
    for event in events:
        if event["Year"] != 0:
            year_list.append(event["Year"])

    incidents_per_year = defaultdict(int)
    for year in year_list:
        incidents_per_year[year] += 1
    print(incidents_per_year)
    
    return jsonify(incidents_per_year)    

@app.route("/victims_per_year")
def victims():
    events = list(shootings.find())
    number_of_victims = []
    number_of_victims = []
    for event in events:
        victims_per_year = {}
        if event["Year"] != 0:
            victims_per_year["Year"] = event["Year"]
            victims_per_year["Fatalities"] = event["Fatalities"]
            victims_per_year["Injured"] = event["Injured"]        
            number_of_victims.append(victims_per_year)
    return jsonify(number_of_victims)


@app.route("/incidents")
def incidents():

    incident_list = []
    src_list1 = []
    src_list2 = []
    # Display items in MongoDB collection
    incidents = db.incidents.find()

    for incident in incidents:

        #clean-up the links in the "source" data field
        source = incident["SOURCES"]
        src_list = source.split(";")
        source = src_list[0]
        src_list2 = source.split(" ")
        source = src_list2[0]

        incident_dict = {
            "place": incident["LOCATION"],
            "state": incident["STATE"],
            "date": incident["DATE"],            
            "name": incident["CASE"],
            "victims" : incident["TOTALVICTIMS"],
            "location": [incident["LATITUDE"], incident["LONGITUDE"]],
            "mental_issues" : incident["PRIORSIGNSOFMENTALILLNESS"],
            "assault_rifle" : incident["ASSAULT"],
            "weapons" : incident["WEAPONSOBTAINEDLEGALLY"],
            "source" : source
        }
        incident_list.append(incident_dict)

    return jsonify(incident_list)


@app.route("/states")
def states():
    return render_template("states.html")

@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/getlaws/<state>")
def getlaws(state):

    # URL of page to be scraped
    base_url = "https://en.wikipedia.org/wiki/Gun_laws_in_"
    url = base_url + state

    # Retrieve page with the requests module
    response = requests.get(url)
    # Create BeautifulSoup object; parse with 'lxml'
    soup = BeautifulSoup(response.text, 'lxml')
    results = soup.find_all('table', class_='wikitable')
    value = Markup(results[0])
    return value

@app.route("/venue")
def shootingvenue():
    events = list(shootings.find())

    venue_list = []
    for event in events:
        if event["Venue"] != "":
            temp = event["Venue"]
            new = temp.replace("\n", "")
            venue_list.append(new)

    d = defaultdict(int)
    for each in venue_list:
        d[each] += 1  

    return jsonify(d) 

if __name__ == "__main__":
    app.run(debug=True)


    
    