import * as SQLite from 'expo-sqlite'
import { Place } from '../models/place';
const database = SQLite.openDatabase('places.db');// if this database doesn't exist => SQLite create it for us
export const init = () => {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS places (
                id INTEGER PRIMARY KEY NOT NULL,
                title TEXT NOT NULL,
                imageUri TEXT NOT NULL,
                address TEXT NOT NULL,
                lat REAL NOT NULL,
                lng REAL NOT NULL
            )`,
          [], // this arrays when you want to pass any value to sql query
          () => {
            resolve();
          }, // this will be call if success
          (_, error) => {
            reject(error);
          } //this will be call if any errors
        );
      });
    });
    return promise
}
export const insertPlace = (place) => {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
              `INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?,?,?,?,?)`,
              [
                place.title,
                place.imageUri,
                place.address,
                place.location.lat,
                place.location.lng,
              ],
              (_, result) => {
                console.log(result);
                resolve(result)
              },
              (_, error) => {
                reject(error);
              }
            );
        })
    })
    return promise
}

export const fetchPlaces = () => {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM places`,
                [],
                (_, result) => {
                    const places = [];
                    for (const dp of result.rows._array){
                        places.push(new Place(dp.title, dp.imageUri, {address: dp.address, lat: dp.lat, lng: dp.lng},dp.id))
                    }
                    resolve(places)
                },
                (_,error) => {
                    reject(error)
                }
            )
        })
    })
    return promise
}

export const fetchPlaceDetails = (id) => {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM places WHERE id = ?`,
                [id],
                (_, result) => {
                    const dp = result.rows._array[0]
                    const place = new Place(dp.title, dp.imageUri, {address: dp.address, lat: dp.lat, lng: dp.lng},dp.id)
                    resolve(place)
                },
                (_,error) => {
                    reject(error)
                }
            )
        })
    })
    return promise
}