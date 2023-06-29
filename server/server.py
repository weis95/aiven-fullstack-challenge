from flask import Flask, json, request
from flask_cors import CORS
import requests
import geopy.distance
from flask_caching import Cache

# https://flask-caching.readthedocs.io/en/latest/
config = {
    "DEBUG": True,                # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}

api = Flask(__name__)
api.config.from_mapping(config)
cache = Cache(api)
CORS(api)


@api.route('/clouds', methods=['POST'])
def get_companies():
    result = requests.get('https://api.aiven.io/v1/clouds').json()

    clouds = []
    providers = []
    coords_1 = (request.json['lat'], request.json['lon'])

    for x in result['clouds']:
        if x['provider_description'] not in providers:
            providers.append(x['provider_description'])

        provider = request.json.get('provider')
        if (provider and provider == x['provider_description']) or provider is None:
            # https://stackoverflow.com/questions/19412462/getting-distance-between-two-points-based-on-latitude-longitude
            coords_2 = (x['geo_latitude'], x['geo_longitude'])
            distance = round(geopy.distance.geodesic(coords_1, coords_2).km)

            clouds.append({
                'provider': x['provider_description'],
                'distance': distance,
                'name': x['cloud_name']
            })

    return {'clouds': clouds, 'providers': providers}


if __name__ == '__main__':
    api.run()
