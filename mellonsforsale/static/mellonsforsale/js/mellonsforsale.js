function ajaxFailure(xhr, status, errorThrown) {
    alert("Sorry, there was a problem!");
    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr);
}

function getCSRFToken() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const c = cookies[i].trim();
        if (c.startsWith("csrftoken=")) {
            return c.substring("csrftoken=".length, c.length);
        }
    }
    return "unknown";
}

let user_pos;

function getUserLat() {
    if (user_pos) {
        return user_pos.lat;
    }
}

function getUserLng() {
    if (user_pos) {
        return user_pos.lng;
    }
}

// Initialize and add map to the Storefront page
function initStorefrontMap() {
    $.ajax({
        url: "/get-storefront-listing",
        data: {
            csrfmiddlewaretoken: getCSRFToken()
        },
        type: "GET",
        dataType: "json"
    })
        .done((res) => {
            const item_list = res.items;

            // Location of CMU
            const cmu = { lat: 40.443, lng: -79.943 };
            // The map, centered at CMU
            const map = new google.maps.Map(
                document.getElementById("map1"), {
                    zoom: 15,
                    center: cmu,
                    disableDefaultUI: true
                }
            );

            const infoWindow = new google.maps.InfoWindow();
            // Try HTML5 geolocation.

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    user_pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    infoWindow.setPosition(user_pos);
                    infoWindow.setContent("Location found.");
                    infoWindow.open(map);
                    // add marker for each item displayed
                    for (let i = 0; i < item_list.length; i++) {
                        const curr_item = item_list[i];
                        const curr = { lat: curr_item.lat, lng: curr_item.long };
                        let dist_message;
                        try {
                            const curr_dist = latLngDistance(curr_item.lat, curr_item.long, user_pos.lat, user_pos.lng);
                            const adj_dist = Math.round((curr_dist + Number.EPSILON) * 100) / 100;
                            dist_message = "<br/><strong> " + adj_dist + " km away </strong>";
                        } catch (e) {
                            dist_message = "";
                        }
                        const marker = new google.maps.Marker({ position: curr, map, item: ("<strong>Item: </strong>" + curr_item.name + "<br/><strong>Address: </strong>" + curr_item.location + dist_message + "<br><strong>Seller: </strong> <a href = '" + curr_item.seller_id + "'>" + curr_item.seller_name + "</a>") });
                        marker.addListener("click", function () {
                            console.log(this);
                            (new google.maps.InfoWindow({
                                content: this.item,
                                maxWidth: 200,
                                position: curr
                            })).open(map, this);
                        });
                    }
                }, () => {
                    user_pos = cmu;
                    infoWindow.setPosition(user_pos);
                    infoWindow.setContent("You do not have location services enabled/supported so your location has been set to CMU.");
                    infoWindow.open(map);
                    // add marker for each item displayed
                    for (let i = 0; i < item_list.length; i++) {
                        const curr_item = item_list[i];
                        const curr = { lat: curr_item.lat, lng: curr_item.long };
                        let dist_message;
                        try {
                            const curr_dist = latLngDistance(curr_item.lat, curr_item.long, user_pos.lat, user_pos.lng);
                            const adj_dist = Math.round((curr_dist + Number.EPSILON) * 100) / 100;
                            dist_message = "<br/><strong> " + adj_dist + " km away </strong>";
                        } catch (e) {
                            dist_message = "";
                        }
                        const marker = new google.maps.Marker({ position: curr, map, item: ("<strong>Item: </strong>" + curr_item.name + "<br/><strong>Address: </strong>" + curr_item.location + dist_message + "<br><strong>Seller: </strong> <a href = '" + curr_item.seller_id + "'>" + curr_item.seller_name + "</a>") });
                        marker.addListener("click", function () {
                            console.log(this);
                            (new google.maps.InfoWindow({
                                content: this.item,
                                maxWidth: 200,
                                position: curr
                            })).open(map, this);
                        });
                    }
                });
            } else {
                // Browser doesn't support Geolocation
                alert("You do not have location services enabled/supported so your current location is set to CMU.");
                user_pos = cmu;
                for (let i = 0; i < item_list.length; i++) {
                    const curr_item = item_list[i];
                    const curr = { lat: curr_item.lat, lng: curr_item.long };
                    const marker = new google.maps.Marker({ position: curr, map, item: ("<strong>Item: </strong>" + curr_item.name + "<br/><strong>Address: </strong>" + curr_item.location + dist_message + "<br><strong>Seller: </strong> <a href = '" + curr_item.seller_id + "'>" + curr_item.seller_name + "</a>") });
                    marker.addListener("click", function () {
                        console.log(this);
                        (new google.maps.InfoWindow({
                            content: this.item,
                            maxWidth: 200,
                            position: curr
                        })).open(map, this);
                    });
                }
            }
        })
        .fail(ajaxFailure);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation.");
    infoWindow.open(map);
}

// Initialize and add map to the Create Item page
function initMap() {
    // The location of CMU
    const cmu = { lat: 40.443, lng: -79.943 };
    // The map, centered at CMU
    const map = new google.maps.Map(
        document.getElementById("map"), {
            zoom: 15,
            center: cmu,
            disableDefaultUI: true
        }
    );
    // The marker, positioned at cmu
    const marker = new google.maps.Marker({ position: cmu, map });
    marker.setVisible(false);

    // Configure the click listener.
    map.addListener("click", (mapsMouseEvent) => {
        const latlng = mapsMouseEvent.latLng;

        const geocoder = new google.maps.Geocoder();
        // Get the address from the lattitude and longitude
        geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === "OK" && results[0]) {
                marker.setPosition(latlng);
                marker.setVisible(true);

                let city = results[0].address_components[3].long_name;
                let state = results[0].address_components[4].long_name;
                console.log(results[0]);
                let zip;
                if (results[0].address_components[7] != undefined) {
                    zip = results[0].address_components[7].long_name;
                } else {
                    zip = results[0].address_components[6].long_name;
                }

                if (city == "Allegheny County") {
                    city = "Pittsburgh";
                    state = "Pennsylvania";
                }

                document.getElementById("street").value = results[0].address_components[0].long_name + " " + results[0].address_components[1].long_name;
                document.getElementById("city").value = city;
                document.getElementById("state").value = state;
                document.getElementById("zip").value = zip;
            } else if (status === "OK") {
                window.alert("No results found");
            } else {
                window.alert("Geocoder failed due to: " + status);
            }
        });
    });
}

// Function to find distance between a pair of lattitudes and longitudes
// Based on the Haversine Formula
function latLngDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radius of the Earth in km
    const latDiff = rad(lat2 - lat1);
    const lngDiff = rad(lng2 - lng1);

    const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2)
            + Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2)
            * Math.cos(rad(lat1)) * Math.cos(rad(lat2));

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// convert degrees to radians
function rad(deg) {
    return deg * (Math.PI / 180);
}
function format_time(time_str) {
    const currentDate = new Date(time_str);
    const date = currentDate.getDate();
    const month = parseInt(time_str.substring(5, 7));
    const year = currentDate.getFullYear();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    if (minutes.toString().length < 2) minutes = "0" + minutes;

    const suffix = hours >= 12 ? "p.m." : "a.m";
    hours = (((hours + 11) % 12) + 1);

    hours = hours.toString() + ":" + minutes.toString() + " " + suffix;

    const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
    formatted_time = months[month - 1] + " " + date + ", " + year + ", " + hours;
    return formatted_time;
}
