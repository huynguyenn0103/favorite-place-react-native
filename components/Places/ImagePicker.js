import { Alert, Button, Image, StyleSheet, Text, View } from "react-native"
import { launchCameraAsync, useCameraPermissions, PermissionStatus } from "expo-image-picker"
import { useState } from "react"
import { Colors } from "../../constants/color"
import OutlinedButton from "../UI/OutlinedButton"
const ImagePicker = ({onTakeImage}) => {
    const [pickedImage, setPickedImage] = useState()
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions()
    const verifyPermission = async () => {
        console.log(cameraPermissionInformation.status)
        console.log(cameraPermissionInformation.canAskAgain)
        if(cameraPermissionInformation.status === PermissionStatus.UNDETERMINED){// if haven't asked for permit yet
            const permissionResponse =  await requestPermission();// request to ask for permission
            return permissionResponse.granted;// true (permitted) or false 
        }
        if(cameraPermissionInformation.status = PermissionStatus.DENIED){//if denied in the past
            if (cameraPermissionInformation.canAskAgain) {
                const permissionResponse = await requestPermission()
                return permissionResponse.granted
            } else {
                Alert.alert(
                    "Insufficient Permissions!",
                    "You need to grant camera permissions to use this app."
                )
                return false
            }
        }
        return true;// if permitted in the past
    }
    const takeImageHandler = async () => {
        const hasPermission = await verifyPermission();
        if(!hasPermission) return;
        const image = await launchCameraAsync({// wait for until finishing taking photo => async and return promise but work for android only => because android ask for permision automatically
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5,

        })
        setPickedImage(image.uri)
        onTakeImage(image.uri)
    }
    let imagePreview = <Text>No image taken yet.</Text>
    if(pickedImage){
        imagePreview = <Image style={styles.image} source={{uri: pickedImage}}/>
    }
    return (
        <View>
            <View style={styles.imagePreview}>
                {imagePreview}
            </View>
            <OutlinedButton icon="camera" onPress={takeImageHandler}>Take Image</OutlinedButton>
        </View>
    )
}
export default ImagePicker
const styles = StyleSheet.create({
    imagePreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%'
    }
})