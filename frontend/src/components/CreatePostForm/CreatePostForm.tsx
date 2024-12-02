import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { PayloadAction } from "@reduxjs/toolkit";
import { makeNewPostThunk } from "../../store/slices/postsSlice";

const CreatePostForm = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const sessionUser = useAppSelector((state) => state.session.sessionUser);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [showUpload, setShowUpload] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [partOfDay, setPartOfDay] = useState("");
  const [datePhotographed, setDatePhotographed] = useState<Date | null>(null);
  const [errors, setErrors] = useState(
    {} as {
      serverError?: string;
      latLngError?: string;
    }
  );

  if (!sessionUser) return <></>;

  const updateImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          setPreviewUrl(reader.result.toString());
        }
      };
      setImgFile(file);
      setShowUpload(false);
    }
  };

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

    const postDetails = new FormData();

    if (!imgFile || !title) {
      return;
    }

    postDetails.append("image", imgFile);
    postDetails.append("title", title);

    if (caption) {
      postDetails.append("caption", caption);
    }
    if (fullDescription) {
      postDetails.append("fullDescription", fullDescription);
    }
    if (datePhotographed) {
      postDetails.append("datePhotographed", datePhotographed.toString());
    }
    if (lat && lng) {
      postDetails.append("lat", lat.toString());
      postDetails.append("lng", lng.toString());
    }
    if (partOfDay) {
      postDetails.append("partOfDay", partOfDay);
    }

    console.log("\n\n In form before sending: ");
    console.log("post details: ", postDetails);

    const serverResponse: PayloadAction<any> = await dispatch(
      makeNewPostThunk(postDetails)
    );

    console.log("\n\nnserver response back in component: ", serverResponse);

    if (serverResponse.payload) {
      console.log("server responses payload: ", serverResponse.payload, "\n\n");
      setErrors({ serverError: serverResponse?.payload?.message });
    } else {
      // redirect user to new post details page on successful creation
    }
  };

  return (
    <>
      <h1 className="update-post-header">Create A Post</h1>
      {errors.serverError && <p className="error-text">{errors.serverError}</p>}
      <form
        encType="multipart/form-data"
        className="form-container flex-col"
        onSubmit={handleSubmit}
      >
        <div>
          <button type="button">
            <label htmlFor="file-upload">
              {" "}
              {showUpload ? "Choose Image" : "Change Image"}
              <input
                hidden
                type="file"
                id="file-upload"
                name="img_url"
                onChange={updateImage}
                accept=".jpg, .jpeg, .png, .gif"
              />
            </label>
          </button>
          {!showUpload && (
            <div>
              <img src={previewUrl} alt="preview" />
            </div>
          )}
        </div>
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
        <button type="submit">Submit Post</button>
      </form>
    </>
  );
};

export default CreatePostForm;
