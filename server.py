import os
from fiona.collection import get_filetype
from flask.helpers import get_debug_flag
import geopandas as gpd
from numpy import nan
from shapely.geometry import Polygon
from flask import Flask, request, send_from_directory, safe_join
import simplejson as json 

app = Flask(__name__, static_folder=os.path.abspath('../vis/shadow-maps/app/'))
geo_network = None
gdf_network = None


@app.route('/', methods=['GET'])
def index():
    load()
    return serve_static('index.html')

@app.route('/<path:filename>', methods=['GET'])
def serve_static(filename):
    return send_from_directory(safe_join(app.root_path,'vis/dist/shadow-maps/'), filename)
    

@app.route('/network', methods=['GET'])
def serve_network():
    return geo_network

@app.route('/distribution', methods=['POST'])
def serve_distribution():
    result_data = []
    coordinates=[]
    indices=[]
    if request.method == 'POST':
        obj = request.get_json()
        for values in obj.values():
            coordinates.append(tuple(values))
        for index,values in gdf_network.within(Polygon(coordinates)).items():
            if values == True:
                indices.append(index)
        data = gdf_network.iloc[indices].describe()
        #for index,row in gdf_network.iloc[indices].iterrows():
            #result_data.append({'winter':row['chi-dec-21'],'summer':row['chi-jun-21'],'fall/spring':row['chi-sep-22']})
        if data['chi-dec-21'][7] != data['chi-dec-21'][7] or data['chi-jun-21'][7] != data['chi-jun-21'][7] or data['chi-sep-22'][7] != data['chi-sep-22'][7]:
             result_data.append({
            'Winter':{'min':0,'25':0, '50':0,'75':0,'max':0},
            'Summer':{'min':0,'25':0, '50':0,'75':0,'max':0},
            'Fall/Spring':{'min':0,'25':0, '50':0,'75':0,'max':0}
            })
        
        else:

            result_data.append({
            'Winter':{'min':data['chi-dec-21'][3],'25':data['chi-dec-21'][4], '50':data['chi-dec-21'][5],'75':data['chi-dec-21'][6],'max':data['chi-dec-21'][7]},
            'Summer':{'min':data['chi-jun-21'][3],'25':data['chi-jun-21'][4], '50':data['chi-jun-21'][5],'75':data['chi-jun-21'][6],'max':data['chi-jun-21'][7]},
            'Fall/Spring':{'min':data['chi-sep-22'][3],'25':data['chi-sep-22'][4], '50':data['chi-sep-22'][5],'75':data['chi-sep-22'][6],'max':data['chi-sep-22'][7]}
            })
        print(result_data)
        return json.dumps(result_data)



    return "hello"

def load():
    global gdf_network
    global geo_network
    gdf_network = gpd.read_file('./chicago-street-shadow.geojson')
    geo_network = gdf_network.to_json()
    

if __name__ == '__main__':
    
    app.run(debug=True, host='127.0.0.1', port=8080)