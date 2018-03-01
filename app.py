# Dependencies
import pymongo
import datetime
from collections import defaultdict
from flask import Flask, render_template, jsonify
from operator import itemgetter

conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)

db = client.us_mass_shootings
collection = db.incidents
shootings = db.shootings
# collection1 = db.gun_laws_by_states

app = Flask(__name__)
@app.route("/")
def plots():
    return render_template("index.html")

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
            "year": incident["YEAR"],            
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

if __name__ == "__main__":
    app.run(debug=True)


    
    