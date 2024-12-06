import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface MapProps {
  lat?: number;
  lng?: number;
  apiKey: string;
}
const PostLocationMap = ({ lat, lng, apiKey }: MapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });

  if (lat === undefined || lng === undefined) {
    return <></>;
  }

  const center = {
    lat,
    lng,
  };

  return (
    isLoaded && (
      <GoogleMap
        center={center}
        mapContainerClassName="google-maps-widget"
        zoom={12}
      >
        <Marker position={center}></Marker>
      </GoogleMap>
    )
  );
};

export default PostLocationMap;
