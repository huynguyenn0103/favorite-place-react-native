import { StyleSheet, View, Alert, Image, Text } from "react-native"
import OutlinedButton from "../UI/OutlinedButton"
import { Colors } from "../../constants/color"
import { getCurrentPositionAsync , useForegroundPermissions, PermissionStatus} from "expo-location"
import { useEffect, useState } from "react"
import { getAddress, getMapPreview } from "../../utils/location"
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native"
const LocationPicker = ({onPickLocation}) => {
    const navigation = useNavigation()
    const route = useRoute()
    const [pickedLocation, setPickedLocation] = useState()
    const isFocused = useIsFocused()// because when comming back from Map component this component doesn't rerender => useEffect not run again => it return true when it or its parent is focused
    const [locationPermissionInformation, requestPermission] = useForegroundPermissions();

    
    useEffect(() => {
        if(isFocused && route.params) {
            const mapPickedLocation = {lat: route.params.pickedLat, lng: route.params.pickedLng}
            setPickedLocation(mapPickedLocation)
        }
    }, [route, isFocused])
    useEffect(() => {
        const handleLocation = async () => {
            if(pickedLocation){
                const address = await getAddress(pickedLocation.lat, pickedLocation.lng)
                onPickLocation({...pickedLocation, address: address})           
            }
        }
        handleLocation()
    },[pickedLocation, onPickLocation])
    const verifyPermissions = async () => {
        if(locationPermissionInformation.status === PermissionStatus.UNDETERMINED){// if haven't asked for permit yet
            const permissionResponse =  await requestPermission();// request to ask for permission
            return permissionResponse.granted;// true (permitted) or false 
        }
        if(locationPermissionInformation.status = PermissionStatus.DENIED){//if denied in the past
            if (locationPermissionInformation.canAskAgain) {
                const permissionResponse = await requestPermission()
                return permissionResponse.granted
            } else {
                Alert.alert(
                    "Insufficient Permissions!",
                    "You need to grant location permissions to use this app."
                )
                return false
            }
        }
        return true;// if permitted in the past
    }
    const getLocationHandler = async () => {
        const hasPermission = await verifyPermissions();
        if(!hasPermission){
            return;
        }
        const location = await getCurrentPositionAsync()
        setPickedLocation({
            lat: location.coords.latitude,
            lng: location.coords.longitude
        })
    }
    const pickOnMapHandler = () => {
        navigation.navigate('Map')
    }
    let locationPreview = <Text>No location picked yet</Text>
    if(pickedLocation){
        locationPreview = (<Image style={styles.image} source={{uri: getMapPreview(pickedLocation.lat, pickedLocation.lng) }}/>)
    }
    return(
        <View>
            <View style={styles.mapPreview}>
                {locationPreview}
            </View>
            <View style={styles.actions}>
                <OutlinedButton icon="location" onPress={getLocationHandler}>Locate User</OutlinedButton>
                <OutlinedButton icon="map" onPress={pickOnMapHandler}>Pick on map</OutlinedButton>
            </View>
        </View>
    )
}
export default LocationPicker
const styles = StyleSheet.create({
    mapPreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4,
        overflow: 'hidden'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
    }
})