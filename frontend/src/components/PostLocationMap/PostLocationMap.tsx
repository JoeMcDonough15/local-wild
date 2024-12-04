import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface MapProps {
  lat?: number;
  lng?: number;
  apiKey: string;
}
const PostLocationMap = ({
  lat = 40.231548,
  lng = -74.954861,
  apiKey,
}: MapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });

  const center = {
    lat,
    lng,
  };

  return (
    isLoaded && (
      <GoogleMap
        center={center}
        mapContainerClassName="google-maps-widget"
        zoom={16}
      >
        <Marker position={center}></Marker>
      </GoogleMap>
    )
  );
};

export default PostLocationMap;
