from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

import math


def get_coordinates(request): 
    # Use geopy to get the lat and long of address entered
    geolocator = Nominatim(user_agent= "mellonsforsale")

    try:
        location = geolocator.geocode("%s %s %s %s" % (request.POST['street'],
            request.POST['city'], request.POST['state'], request.POST['zip']))
        latitude = location.latitude
        longitude = location.longitude
    except (GeocoderTimedOut, AttributeError) as e:
        latitude = 40.0
        longitude = 40.0
    return latitude, longitude

# Haversine's formula
def item_haversine(item, lat, lng):
    loc = item.location

    R = 6371
    lat1 = math.radians(lat)
    lat2 = math.radians(loc.latitude)
    lng1 = math.radians(lng)
    lng2 = math.radians(loc.longitude)
    d_lat = lat2 - lat1
    d_lng = lng2 - lng1

    a = (math.sin(d_lat/2) ** 2) + math.cos(lat1) * math.cos(lat2) * (math.sin(d_lng/2) ** 2)
    c = 2 * math.atan2( a ** 0.5, (1 - a) ** 0.5 )
    d = R * c
    return d