import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {windowHeight, windowWidth} from '../../utils/Dimensions';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoicmV0cmlldmVyIiwiYSI6ImNrenFhd29tZDJkYnIyb254NXNqajBrZHgifQ.vi6MNpEQwvNm7XSx7h3H9Q',
);
//centerCoordinate={[7.049001, 125.569912]}
const Mapbox = props => {
  const [coordinates] = useState([7.049001, 125.569912]);

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.PointAnnotation />
        </MapboxGL.MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    height: windowHeight,
    width: windowWidth,
    backgroundColor: 'tomato',
  },
  map: {
    flex: 1,
  },
});

export default Mapbox;
