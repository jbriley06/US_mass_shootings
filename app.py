# import necessary libraries
from flask import (
    Flask,
    json,
    render_template,
    jsonify)

import pymongo

# Initialize PyMongo to work with MongoDBs
conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)

# Define database and collection
db = client.us_mass_shootings
collection = db.incidents

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

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


# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
