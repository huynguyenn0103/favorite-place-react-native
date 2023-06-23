import { useCallback, useLayoutEffect, useState } from 'react'
import { Alert, StyleSheet } from 'react-native'
import MapView, {Marker} from 'react-native-maps'
import IconButton from '../components/UI/IconButton'
const Map = ({navigation, route}) => {
  const initialLocation = route.params && {
    lat: route.params.initialLat,
    lng: route.params.initialLng,
  };
    const [selectedLocation, setSelectedLocation] = useState(initialLocation)
    const selectLocationHandler = (event) => {
        if(initialLocation){// if in readonly mode
          return;
        }
        const lat = event.nativeEvent.coordinate.latitude;
        const lng = event.nativeEvent.coordinate.longitude;
       setSelectedLocation({
        lat: lat,
        lng: lng
       })
    }
    const region = {
        latitude: initialLocation? initialLocation.lat : 10.790689917649484,
        longitude: initialLocation? initialLocation.lng : 106.686868913793,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    }
    const savePickedLocationHandler = useCallback(() => {
        if(!selectedLocation){
            Alert.alert('No location picked!', 'You have to pick a location (by tapping on the map) first!')
            return;
        }
        navigation.navigate("AddPlace", {
          pickedLat: selectedLocation.lat,
          pickedLng: selectedLocation.lng,
        });
    },[selectedLocation, navigation])
    useLayoutEffect(() => {
        if(initialLocation){
          return;
        }
        navigation.setOptions({
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="save"
              size={24}
              color={tintColor}
              onPress={savePickedLocationHandler}
            />
          ),
        });
    }, [navigation, savePickedLocationHandler, initialLocation])
    return (
      <MapView
        style={styles.map}
        initialRegion={region}
        onPress={selectLocationHandler}
      >
        {selectedLocation && (
          <Marker
            title="Picked Location"
            coordinate={{
              latitude: selectedLocation.lat,
              longitude: selectedLocation.lng,
            }}
          />
        )}
      </MapView>
    );
}
export default Map
const styles = StyleSheet.create({
    map: {
        flex: 1
    }
})