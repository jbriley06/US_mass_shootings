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

app = Flask(__name__)
@app.route("/")
def plots():
    return render_template("index.html")

@app.route("/incidents_per_year")
def index():
    events = list(collection.find())

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
    events = list(collection.find())
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
            
            
#     # print(number_of_victims)
#     number_of_victims_sorted_by_year = sorted(number_of_victims, key=lambda k: k['Year'])
    
#     return jsonify(number_of_victims_sorted_by_year)

# @app.route("/victims_by_city")
# def victimsbycity():
#     events = list(collection.find())
#     number_of_victims = []
#     for event in events:
#         victims_per_year = {}
#         if event["Year"] != 0:
#             victims_per_year["Year"] = event["Year"]
#             victims_per_year["Total_Victims"] = event["Total victims"]
#             victims_per_year["City"] = event["Location"]        
#             number_of_victims.append(victims_per_year)

#     number_of_victims_sorted_by_year = sorted(number_of_victims, key=lambda k: k['Year'])
    
#     return jsonify(number_of_victims_sorted_by_year)

if __name__ == "__main__":
    app.run(debug=True)


    
    