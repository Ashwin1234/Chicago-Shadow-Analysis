import os
import geopandas as gpd
from shapely.geometry import Polygon
from flask import Flask, request, send_from_directory, safe_join

app = Flask(__name__, static_folder=os.path.abspath('../vis/shadow-maps/app/'))
geo_network = None
gdf_network = None

@app.route('/', methods=['GET'])
def index():
    return serve_static('index.html')

@app.route('/<path:filename>', methods=['GET'])
def serve_static(filename):
    return send_from_directory(safe_join(app.root_path,'vis/dist/shadow-maps/'), filename)

@app.route('/network', methods=['GET'])
def serve_network():
    pass

@app.route('/distribution', methods=['POST'])
def serve_distribution():
    pass

def load():
    global gdf_network
    global geo_network
    gdf_network = gpd.read_file('./chicago-street-shadow.geojson')
    geo_network = gdf_network.to_json()

if __name__ == '__main__':
    load()
    app.run(debug=True, host='127.0.0.1', port=8080)