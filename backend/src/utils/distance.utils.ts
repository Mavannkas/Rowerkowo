export function getDistanceFromLatLonInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000; // Radius of the Earth in meters
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in meters
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

function metersToLatitude(meters: number): number {
  return meters / 111320;
}

function metersToLongitude(meters: number, latitude: number): number {
  return meters / (111320 * Math.cos((latitude * Math.PI) / 180));
}

export function getSquare(
  latitude: number,
  longitude: number,
  meters: number,
): {
  latitudeTop: number;
  latitudeBottom: number;
  longitudeTop: number;
  longitudeBottom: number;
} {
  let square = {
    latitudeTop: +latitude + metersToLatitude(meters),
    latitudeBottom: +latitude - metersToLatitude(meters),
    longitudeTop: +longitude + metersToLongitude(meters, latitude),
    longitudeBottom: +longitude - metersToLongitude(meters, latitude),
  };
  return square;
}

export function calculateBoundingBox(lat1, lon1, lat2, lon2, distance) {
  const R = 6378000;

  const distanceInRadians = distance / R;

  const angle = Math.atan2(lat2 - lat1, lon2 - lon1);

  const orthogonalAngle = angle + Math.PI / 2;

  const latOffset = distanceInRadians * Math.cos(orthogonalAngle);
  const lonOffset = distanceInRadians * Math.sin(orthogonalAngle) / Math.cos((lat1 + lat2) * Math.PI / 360);

  const lat1Min = lat1 - latOffset * (180 / Math.PI);
  const lon1Min = lon1 - lonOffset * (180 / Math.PI);

  const lat2Max = lat2 + latOffset * (180 / Math.PI);
  const lon2Max = lon2 + lonOffset * (180 / Math.PI);

  const latMin = Math.min(lat1Min, lat2Max);
  const lonMin = Math.min(lon1Min, lon2Max);
  const latMax = Math.max(lat1Min, lat2Max);
  const lonMax = Math.max(lon1Min, lon2Max);

  return [latMin, lonMin, latMax, lonMax];
}
