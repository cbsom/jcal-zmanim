import Location from './JCal/Location.js';
import { createRequire } from "module";
import { distance } from 'closest-match';
const require = createRequire(import.meta.url);
const locations = require('./locations.json');
/**
 * NOTE: South and East are negative.
 */
type Point = { latitude: number, longitude: number };


const Locations = locations.map((l: { name: string; heb: string | undefined; il: any; lat: number; lon: number; tz: number; el: any; cl: number | undefined; }) =>
    new Location(l.name, l.heb, !!l.il, l.lat, l.lon, l.tz, l.el || 0, l.cl));

//Sort the Locations by name
Locations.sort(function (a:Location, b:Location) {
    return a.Name > b.Name ? 1 : b.Name > a.Name ? -1 : 0;
});
//The location names and indexes - until the first comma and in lowercase.
const justNames: { name: string, index: number }[] = [];
for (let i = 0; i < Locations.length - 1; i++) {
    const l = Locations[i];
    justNames.push({
        name: l.Name.split(',', 1)[0].toLowerCase(), index: i
    });
    if (!!l.NameHebrew) {
        justNames.push({
            name: l.NameHebrew, index: i
        });
    }
}

/**
 * Get the distance between two points in Kilometers
 * @param {Point} point1 
 * @param {Point} point2 
 * @returns {number}
 */
function distancePointToPoint(point1: Point, point2: Point): number {
    if ((point1.latitude == point2.latitude) && (point1.longitude == point2.longitude)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * point1.latitude / 180;
        var radlat2 = Math.PI * point2.latitude / 180;
        var theta = point1.longitude - point2.longitude;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344
        return dist;
    }
}

/**
 * Find the Location (city) that is the closest to the given point of coordinates.
 * @param {Point} point 
 * @returns 
 */
function closestDistanceMatch(point: Point): Location | undefined {
    let curr: { dist: number, location?: Location } = { dist: 100000 };
    for (let location of Locations) {
        const dist = distancePointToPoint(point, { latitude: location.Latitude, longitude: location.Longitude });
        if (dist < curr.dist) {
            curr = { dist, location };
        }
    }
    return curr.location;
}

/**
 * Find the Location (city) who's city name is the closest match to the given point of coordinates.
 * @param {string} val
 * @returns 
 */
function closestNameMatch(val: string): Location | undefined {
    let curr: {
        dist: number, location?: { name: string, index: number }
    } = { dist: 100000 };
    for (let location of justNames) {
        const dist = distance(val.toLowerCase(), location.name);
        if (dist < curr.dist) {
            curr = { dist, location };
        }
    }
    return curr.location ? Locations[curr.location.index] : undefined;
}

/**
 * Option 1: Find a location with the given name
 * Option 2: Find the location with the name that is most similar to the given name
 * Option 3: Find the Location with the given coordinates
 * Option 4: Find the location closest to the given coordinates
 * @param {String|Point} nameOrCoordinates
 */
function findLocation(nameOrCoordinates: string | Point): Location | undefined {
    if (typeof nameOrCoordinates === 'string') {
        //First simply try to find an exact (case insensitive) match
        const exactNameMatch = Locations.find((l: Location) =>
            l.Name.toLowerCase() === nameOrCoordinates.toLowerCase() || l.NameHebrew === nameOrCoordinates);
        if (!!exactNameMatch) {
            return exactNameMatch;
        }
        //Next, we try to find an exact (case insensitive) match up untill the first comma
        const cityOnlyNameMatch = justNames.find(l =>
            l.name === nameOrCoordinates.toLowerCase());
        if (!!cityOnlyNameMatch) {
            return Locations[cityOnlyNameMatch.index];
        }
        //As a last resort, try to use some fancy algorithm to get the closest name match
        return closestNameMatch(nameOrCoordinates.toLowerCase(),)
    }
    else { //The given parameter is a Point of coordinates
        const exactCoordinateMatch = Locations.find((l:Location) =>
            l.Latitude === nameOrCoordinates.latitude &&
            l.Longitude === nameOrCoordinates.longitude);
        if (!!exactCoordinateMatch) {
            return exactCoordinateMatch;
        }
        return closestDistanceMatch(nameOrCoordinates);
    }
}

export { Locations, findLocation, closestDistanceMatch, closestNameMatch };
