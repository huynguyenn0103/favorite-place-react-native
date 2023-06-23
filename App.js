import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AllPlaces from './screens/AllPlaces';
import AddPlace from './screens/AddPlace';
import IconButton from './components/UI/IconButton';
import { Colors } from './constants/color';
import Map from './screens/Map';
import { useCallback, useEffect, useState } from 'react';
import { init } from './utils/database';
import * as SplashScreen from 'expo-splash-screen'
import PlaceDetails from './screens/PlaceDetails';
const Stack = createNativeStackNavigator();
export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await init();
        await new Promise(r => setTimeout(r, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setDbInitialized(true);
      }
    };
    prepare();
  }, []);
  const onLayoutRootView = useCallback(
    async () => {
      if (dbInitialized) {
        await SplashScreen.hideAsync();
      }
    },
    [dbInitialized]
  );
  if (!dbInitialized) return null;
  return (
    <>
      <StatusBar style='dark'/>
      <NavigationContainer onReady={onLayoutRootView}>
        <Stack.Navigator screenOptions={{
          headerStyle: {backgroundColor: Colors.primary500},
          headerTintColor: Colors.gray700,
          contentStyle: {
            backgroundColor: Colors.gray700
          }
        }}>
          <Stack.Screen name='AllPlaces' component={AllPlaces} options={({navigation}) => ({
            title: 'Your Favorite Places',
            headerRight: ({tintColor}) => <IconButton icon="add" size={24} color={tintColor} onPress={() => navigation.navigate('AddPlace')}/>
          })}/>
          <Stack.Screen name='AddPlace' component={AddPlace} options={{title: 'Add a new Place'}}/>
          <Stack.Screen name='Map' component={Map}/>
          <Stack.Screen name='PlaceDetails' component={PlaceDetails} options={{title: 'Loading Place...'}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

// npm install @react-navigation/native @react-navigation/native-stack
//expo install react-native-screens react-native-safe-area-context
// expo install expo-image-picker => access image in device
// expo install expo-location
//expo install react-native-maps
//expo install expo-sqlite
//expo install expo-splash-screen