export type LatLng = [number, number];

// Converts from degrees to radians.
export const toRadians = (degrees: number): number => {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
export const toDegrees = (radians: number): number => {
    return radians * 180 / Math.PI;
};


export const bearingFromTo = (start: LatLng, destination: LatLng): number => {
    let [startLat, startLng] = start;
    let [destLat, destLng] = destination;
    startLat = toRadians(startLat);
    startLng = toRadians(startLng);
    destLat = toRadians(destLat);
    destLng = toRadians(destLng);

    const y = Math.sin(destLng - startLng) * Math.cos(destLat);
    const x = Math.cos(startLat) * Math.sin(destLat) -
        Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    const brng = toDegrees(Math.atan2(y, x));
    return (brng + 360) % 360;
};

export const differanceBetweenAngle = (target: number, current: number): number => {
    return (target - current) % 360;
};

export const distanceInMetersBetween = (start: LatLng, destination: LatLng): number => {
    let [lat1, lon1] = start;
    let [lat2, lon2] = destination;
    const R = 6378137;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    lat1 = toRadians(lat1);
    lat2 = toRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}


export const getPositionPromise = (options: PositionOptions): Promise<Position> => {
    return new Promise(function (resolve: PositionCallback, reject: PositionErrorCallback) {
        return navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}
