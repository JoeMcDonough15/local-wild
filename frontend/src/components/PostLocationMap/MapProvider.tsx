import PostLocationMap from "./PostLocationMap";
import { useAppSelector, useAppDispatch } from "../../store";
import { getKeyThunk } from "../../store/slices/mapsSlice";
import { useEffect } from "react";

const MapProvider = () => {
  const key = useAppSelector((state) => state.maps.mapsKey);
  const currentPost = useAppSelector((state) => state.posts.currentPost);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getKeyThunk());
  }, [dispatch]);

  if (!key || !currentPost || !currentPost.lat || !currentPost.lng) {
    return <></>;
  }

  return (
    <PostLocationMap
      apiKey={key}
      lat={Number(currentPost.lat)}
      lng={Number(currentPost.lng)}
    />
  );
};

export default MapProvider;
