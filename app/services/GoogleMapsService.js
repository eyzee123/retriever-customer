const getDistance = () => {
  //Find the distance

  var distanceService = new google.maps.DistanceMatrixService();
  distanceService.getDistanceMatrix(
    {
      origins: [$('#autocompleteDeparture').val()],
      destinations: [$('#autocompleteArrival').val()],
      travelMode: google.maps.TravelMode.WALKING,
      unitSystem: google.maps.UnitSystem.METRIC,
      durationInTraffic: true,
      avoidHighways: false,
      avoidTolls: false,
    },
    function (response, status) {
      if (status !== google.maps.DistanceMatrixStatus.OK) {
        console.log('Error:', status);
      } else {
        console.log(response.rows[0].elements[0].distance.text);
        console.log(response.rows[0].elements[0].duration.text);
      }
    },
  );
};

export {getDistance};
