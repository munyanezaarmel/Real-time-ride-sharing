import React, { useState, useRef, useEffect } from "react";
import "./map.css"

const MapRoute = () => {
  const stops = [
    new window.google.maps.LatLng(-1.9355377074007851, 30.060163829002217),
    new window.google.maps.LatLng(-1.9383356478629084, 30.048964691832023),
    new window.google.maps.LatLng(-1.9311299892123315, 30.063287629602982),
    new window.google.maps.LatLng(-1.9357307207601322, 30.06195747257057),
    new window.google.maps.LatLng(-1.9359589579660512, 30.053415164361436),
    new window.google.maps.LatLng(-1.9365670876910166, 30.13020167024439),
  ];

  const mapRouteRef = useRef(null);
  const [routeMap, setRouteMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [nextStop, setNextStop] = useState(null);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);

  useEffect(() => {
    const googleMap = evokeGMap();
    setRouteMap(googleMap);
  }, []);

  useEffect(() => {
    if (!routeMap) return;

    const mapDirService = new window.google.maps.DirectionsService();
    const mapDirRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
    });

    const nyabugogo = new window.google.maps.LatLng(
      -1.939826787816454,
      30.0445426438232
    );
    const kimironko = new window.google.maps.LatLng(
      -1.9365670876910166,
      30.13020167024439
    );

    const routeRequest = {
      origin: nyabugogo,
      destination: kimironko,
      waypoints: stops.map((stop) => ({ location: stop, stopover: true })),
      travelMode: "DRIVING",
    };

    mapDirService.route(routeRequest, function (response, status) {
      if (status === "OK") {
        mapDirRenderer.setDirections(response);
        mapDirRenderer.setMap(routeMap);
        moveRouteMarker(routeMap, response.routes[0].overview_path);
        setDirectionsResponse(response);
        const nextStopInfo = response.routes[0].legs[currentStopIndex + 1];
        setNextStop({
          end_address: nextStopInfo.end_address,
          distance: nextStopInfo.distance,
          duration: nextStopInfo.duration,
        });
      }
    });
  }, [routeMap]);

  useEffect(() => {
    if (!routeMap) return;

    stops.forEach((stop) => {
      new window.google.maps.Marker({
        position: stop,
        map: routeMap,
        title: "Stop",
      });
    });
  }, [directionsResponse]);

  useEffect(() => {
    if (directionsResponse && nextStop) {
      const durationUntilNextStop = nextStop.duration.value;
      const timeout = setTimeout(() => {
        handleNextStop();
      }, durationUntilNextStop * 1000);
      return () => clearTimeout(timeout);
    }
  }, [nextStop, directionsResponse]);

  const evokeGMap = () => {
    return new window.google.maps.Map(mapRouteRef.current, {
      center: new window.google.maps.LatLng(
        -1.939826787816454,
        30.0445426438232
      ),
      zoom: 17,
    });
  };
  const moveRouteMarker = async (map, routeCoord) => {
    if (!directionsResponse) return;

    const nextStopIndex = currentStopIndex + 1;
    if (nextStopIndex < directionsResponse.routes[0].legs.length) {
      const nextStopInfo = directionsResponse.routes[0].legs[nextStopIndex];
      setNextStop({
        end_address: nextStopInfo.end_address,
        distance: nextStopInfo.distance,
        duration: nextStopInfo.duration,
      });
    }
    const marker = new window.google.maps.Marker({
      position: routeCoord[0],
      map,
      zIndex: 99,
      optimized: false,
    });
    for (let i = 0; i < routeCoord.length; i++) {
      await animateMarker(marker, marker.getPosition(), routeCoord[i], 0.06);
    }
  };
  useEffect(() => {
    if (directionsResponse) {
      moveRouteMarker(routeMap, directionsResponse.routes[0].overview_path);
    }
  }, [directionsResponse, routeMap]);

  const animateMarker = async (marker, moveFrom, moveTo, t, delta = 100) => {
    return new Promise((resolve) => {
      const routeLat = (moveTo.lat() - moveFrom.lat()) / delta;
      const routeLong = (moveTo.lng() - moveFrom.lng()) / delta;
      let delay = 1000 * t,
        count = 0;
      for (let i = 0; i < delta; i++) {
        (function (data) {
          setTimeout(function () {
            let lat = marker.position.lat();
            let lng = marker.position.lng();
            lat += routeLat;
            lng += routeLong;
            marker.setPosition(new window.google.maps.LatLng(lat, lng));
            count++;
            if (count === delta) {
              resolve(marker);
            }
          }, delay * data);
        })(i);
      }
    });
  };

  const handleNextStop = () => {
    if (
      directionsResponse &&
      currentStopIndex < directionsResponse.routes[0].legs.length - 1
    ) {
      setCurrentStopIndex(currentStopIndex + 1);
      const nextStopInfo =
        directionsResponse.routes[0].legs[currentStopIndex + 1];
      setNextStop({
        end_address: nextStopInfo.end_address,
        distance: nextStopInfo.distance,
        duration: nextStopInfo.duration,
      });
    }
  };

  return (
    <div >
      <h2>
        {nextStop && (
          <div class="box">
            <p className="text-3xl font-bold underline">nyabugogo-Kimironko</p>
            <p>Next Stop: {nextStop.end_address}</p>
            <div class="flex">
              <p class="mr-2">Distance: : {nextStop.distance.text}</p>
              <p>Time: {nextStop.duration.text}</p>
            </div>
          </div>
        )}
      </h2>
      <div ref={mapRouteRef} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default MapRoute;
