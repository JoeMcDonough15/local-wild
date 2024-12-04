import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

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

  const containerStyle = {
    height: "400px",
    width: "400px",
  };

  return (
    isLoaded && (
      <GoogleMap center={center} mapContainerStyle={containerStyle} zoom={10} />
    )
  );
};

export default PostLocationMap;
