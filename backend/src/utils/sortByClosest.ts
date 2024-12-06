const RADIUS_OF_EARTH = 6371;

const convertDegreesToRadians = (degrees: number) => {
  return degrees / (Math.PI * 180);
};

// Haversine's formula to determine the distance between the two coordinates
const calculateDistance = (
  userLat: number,
  userLng: number,
  postLat: number,
  postLng: number
) => {
  userLat = convertDegreesToRadians(userLat);
  postLat = convertDegreesToRadians(postLat);
  userLng = convertDegreesToRadians(userLng);
  postLng = convertDegreesToRadians(postLng);

  const differenceInLong = postLng - userLng;
  const differenceInLat = postLat - userLat;

  const a =
    Math.sin(differenceInLat / 2) ** 2 +
    Math.cos(userLat) * Math.cos(postLat) * Math.sin(differenceInLong / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(a));

  const distance = RADIUS_OF_EARTH * c;
  return distance;
};

export default calculateDistance;
