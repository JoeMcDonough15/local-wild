import { useState } from "react";
import { useModal } from "../../context/useModal";
import { useAppDispatch, useAppSelector } from "../../store";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  updatePostThunk,
  getSinglePostThunk,
} from "../../store/slices/postsSlice";
import { PostUpdate, UpdateOrDeletePostArgs, LoadingState } from "../../types";

const EditPostFormModal = ({ postId, key }: UpdateOrDeletePostArgs) => {
  const dispatch = useAppDispatch();
  const currentPost = useAppSelector((state) => state.posts.currentPost);
  const { closeModal } = useModal();
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [partOfDay, setPartOfDay] = useState("");
  const [datePhotographed, setDatePhotographed] = useState<Date | null>(null);
  const [originalPostLoaded, setOriginalPostLoaded] =
    useState<LoadingState>("no");
  const [errors, setErrors] = useState(
    {} as {
      serverError?: string;
      latLngError?: string;
    }
  );

  if (originalPostLoaded === "no") {
    setOriginalPostLoaded("loading");
  } else if (originalPostLoaded === "loading") {
    dispatch(getSinglePostThunk(postId)).then(() => {
      setOriginalPostLoaded("response");
    });
  } else if (originalPostLoaded === "response") {
    // we should now have a currentPost
    if (currentPost) {
      setTitle(currentPost.title);
    }
    if (currentPost?.caption) {
      setCaption(currentPost.caption);
    }
    if (currentPost?.fullDescription) {
      setFullDescription(currentPost.fullDescription);
    }
    if (currentPost?.lat && currentPost?.lng) {
      setLat(currentPost.lat);
      setLng(currentPost.lng);
    }
    if (currentPost?.datePhotographed) {
      setDatePhotographed(currentPost.datePhotographed);
    }
    if (currentPost?.partOfDay) {
      setPartOfDay(currentPost.partOfDay);
    }

    setOriginalPostLoaded("finished");
  }

  const handleClientSideErrors = () => {
    const clientErrors = {} as { latLngError?: string };
    const errorMessage = "Either both or neither lat and lng must be provided";
    if ((lat && !lng) || (lng && !lat)) {
      clientErrors.latLngError = errorMessage;
    }

    return clientErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const clientErrors = handleClientSideErrors();

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setErrors({});

    const postDetails: PostUpdate = { title };

    if (caption) {
      postDetails.caption = caption;
    }
    if (fullDescription) {
      postDetails.fullDescription = fullDescription;
    }
    if (datePhotographed) {
      postDetails.datePhotographed = datePhotographed;
    }
    if (lat && lng) {
      postDetails.lat = lat;
      postDetails.lng = lng;
    }
    if (partOfDay) {
      postDetails.partOfDay = partOfDay;
    }

    const editArgs: UpdateOrDeletePostArgs = { postId, key, postDetails };

    const serverResponse: PayloadAction<any> = await dispatch(
      updatePostThunk(editArgs)
    );

    if (serverResponse.payload) {
      setErrors({ serverError: serverResponse?.payload?.message });
    } else {
      setOriginalPostLoaded("no");
      closeModal();
    }
  };

  return (
    <>
      <h1 className="update-post-header">Edit A Post</h1>
      {errors.serverError && <p className="error-text">{errors.serverError}</p>}
      <form className="form-container flex-col" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Caption
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </label>
        <label>
          Full Description
          <input
            type="textarea"
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
          />
        </label>
        {errors.latLngError && (
          <p className="error-text">{errors.latLngError}</p>
        )}
        <label>
          Latitude
          <input
            type="number"
            value={lat?.toString()}
            onChange={(e) => setLat(Number(e.target.value))}
          />
        </label>
        <label>
          Longitude
          <input
            type="number"
            value={lng?.toString()}
            onChange={(e) => setLng(Number(e.target.value))}
          />
        </label>
        <label>
          Part of Day
          <input
            type="text"
            value={partOfDay}
            onChange={(e) => setPartOfDay(e.target.value)}
          />
        </label>
        <label>
          Date Photographed
          <input
            type="date"
            value={datePhotographed?.toString()}
            onChange={(e) => setDatePhotographed(new Date(e.target.value))}
          />
        </label>
        <button type="submit">Update Your Post</button>
      </form>
    </>
  );
};

export default EditPostFormModal;
