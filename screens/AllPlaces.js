import { useIsFocused } from "@react-navigation/native"
import PlacesList from "../components/Places/PlacesList"
import { useEffect, useState } from "react";
import { fetchPlaces } from "../utils/database";

const AllPlaces = ({route}) => {
 const [loadedPlaces, setLoadedPlaces] = useState([])
 const isFocused = useIsFocused();
 useEffect(() => {
    const loadPlaces = async () => {
        const places = await fetchPlaces()
        setLoadedPlaces(places)
    }
    if(isFocused) {
        loadPlaces()
    }
 },[isFocused])
 return <PlacesList places={loadedPlaces}/>
}
export default AllPlaces