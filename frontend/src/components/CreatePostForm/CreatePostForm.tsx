import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useAppDispatch, useAppSelector } from "../../store";
import { makeNewPostThunk } from "../../store/slices/postsSlice";
import { useNavigate } from "react-router-dom";
import { Post, ServerError } from "../../types";
import "./CreatePostForm.css";
import { dateAsString } from "../../utils/formatter";

const CreatePostForm = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sessionUser = useAppSelector((state) => state.session.sessionUser);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [showUpload, setShowUpload] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [locationString, setLocationString] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [partOfDay, setPartOfDay] = useState("");
  const [datePhotographed, setDatePhotographed] = useState<Date>(new Date());
  const [errors, setErrors] = useState(
    {} as {
      serverError?: string;
      latLngError?: string;
      titleRequired?: string;
      titleTooLong?: string;
      captionTooLong?: string;
      fullDescriptionTooLong?: string;
      locationStringTooLong?: string;
      partOfDayTooLong?: string;
      imgFileRequired?: string;
    }
  );

  if (!sessionUser) {
    navigate("/#skip-intro");
    return <></>;
  }

  const updateImage = async (file: File) => {
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

  const DragAndDropOneFile = () => {
    const onDrop = useCallback((files: File[]) => {
      const file = files[0];
      if (file) {
        updateImage(file);
      }
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      maxFiles: 1,
      accept: { "image/jpeg": [], "image/png": [], "image/jpg": [] },
    });

    return (
      <div className="drag-container" {...getRootProps()}>
        <label htmlFor="file-upload">
          <input accept="png jpeg jpg" id="file-upload" {...getInputProps()} />
        </label>
        {isDragActive ? (
          <p>Drop photo here</p>
        ) : (
          <>
            <p>Drag a file here or click to select one.</p>
          </>
        )}
      </div>
    );
  };

  const handleClientSideErrors = () => {
    const clientErrors = {} as {
      latLngError?: string;
      titleRequired?: string;
      titleTooLong?: string; // 50 max
      captionTooLong?: string; // 75
      fullDescriptionTooLong?: string; // 5000 max
      locationStringTooLong?: string; // 255 max
      partOfDayTooLong?: string; // 50 max
      imgFileRequired?: string;
    };

    if ((lat && !lng) || (lng && !lat)) {
      clientErrors.latLngError =
        "Either both or neither lat and lng must be provided";
    }
    if (title.length === 0) {
      clientErrors.titleRequired = "Title is required";
    }
    if (title.length > 50) {
      clientErrors.titleTooLong = "Title must be 50 characters or less.";
    }
    if (caption.length > 75) {
      clientErrors.captionTooLong = "Caption must be 75 characters or less.";
    }
    if (fullDescription.length > 5000) {
      clientErrors.fullDescriptionTooLong =
        "Full description must be 5,000 characters or less";
    }
    if (locationString.length > 255) {
      clientErrors.locationStringTooLong =
        "Location must be 255 characters or less";
    }
    if (partOfDay.length > 50) {
      clientErrors.partOfDayTooLong =
        "Part of day must be 50 characters or less";
    }

    if (!imgFile) {
      clientErrors.imgFileRequired = "You must attach an image";
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

    const serverResponse: any | Post | ServerError = await dispatch(
      makeNewPostThunk(postDetails)
    ).unwrap();

    if (serverResponse.status >= 400) {
      setErrors({ serverError: serverResponse.message });
    } else {
      // redirect user to new post details page on successful creation
      const newPost = serverResponse;
      navigate(`/posts/${newPost.id}`);
    }
  };

  return (
    <div className="page-wrapper">
      <section className="create-post-page flex-col below-header main-container">
        <h1 className="create-post-header">Share A Photo</h1>
        {errors.serverError && (
          <p className="error-text">{errors.serverError}</p>
        )}
        <form
          encType="multipart/form-data"
          className="form-container flex-col"
          onSubmit={handleSubmit}
        >
          <div>
            {showUpload ? (
              <DragAndDropOneFile />
            ) : (
              <div>
                <img className="preview-img" src={previewUrl} alt="preview" />
                <button
                  className="signup-button"
                  onClick={() => {
                    setShowUpload(true);
                    setImgFile(null);
                  }}
                  type="button"
                >
                  Select a different file
                </button>
              </div>
            )}
            {errors.imgFileRequired && (
              <p className="error-text">{errors.imgFileRequired}</p>
            )}
          </div>
          <div className="flex-col post-input-container">
            <label htmlFor="post-title">Title</label>
            <input
              id="post-title"
              type="text"
              placeholder="This field is required"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.titleRequired && (
              <p className="error-text">{errors.titleRequired}</p>
            )}
            {errors.titleTooLong && (
              <p className="error-text">{errors.titleTooLong}</p>
            )}
          </div>
          <div className="flex-col post-input-container">
            <label htmlFor="post-caption">Caption</label>
            <input
              id="post-caption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            {errors.captionTooLong && (
              <p className="error-text">{errors.captionTooLong}</p>
            )}
          </div>
          <div className="flex-col post-input-container">
            <label htmlFor="post-description">Full Description</label>
            <textarea
              rows={10}
              id="post-description"
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
            />
            {errors.fullDescriptionTooLong && (
              <p className="error-text">{errors.fullDescriptionTooLong}</p>
            )}
          </div>
          <div className="flex-col post-input-container">
            <label htmlFor="post-date">Date Photographed</label>
            <input
              id="post-date"
              type="date"
              max={new Date().toISOString().substring(0, 10)}
              value={dateAsString(datePhotographed)}
              onChange={(e) => {
                console.log("value: ", e.target.value);
                const dateToSet = new Date(e.target.value + "T12:00:00.000");
                setDatePhotographed(new Date(dateToSet));
              }}
            />
          </div>
          <div className="more-details flex-col">
            <h5 className="help-header">
              Help other photographers spot this same critter!
            </h5>
            <div className="flex-col post-input-container">
              <label htmlFor="post-location">
                Where were you when you got this picture?
              </label>
              <input
                id="post-location"
                type="text"
                value={locationString}
                onChange={(e) => setLocationString(e.target.value)}
              />
              {errors.locationStringTooLong && (
                <p className="error-text">{errors.locationStringTooLong}</p>
              )}
            </div>

            <fieldset className="lat-lng-fieldset">
              <legend>Did you drop a pin?</legend>
              <div className="flex-row post-input-row">
                <label htmlFor="post-lat">Latitude</label>
                <input
                  id="post-lat"
                  type="number"
                  value={lat?.toString()}
                  onChange={(e) => setLat(Number(e.target.value))}
                />
              </div>
              <div className="flex-row post-input-row">
                <label htmlFor="post-lng">Longitude</label>
                <input
                  id="post-lng"
                  type="number"
                  value={lng?.toString()}
                  onChange={(e) => setLng(Number(e.target.value))}
                />
                {errors.latLngError && (
                  <p className="error-text">{errors.latLngError}</p>
                )}
              </div>
            </fieldset>
            <div className="flex-col post-input-container">
              <label htmlFor="post-part-of-day">
                What part of the day was it?
              </label>
              <input
                id="post-part-of-day"
                type="text"
                value={partOfDay}
                placeholder="early afternoon"
                onChange={(e) => setPartOfDay(e.target.value)}
              />
              {errors.partOfDayTooLong && (
                <p className="error-text">{errors.partOfDayTooLong}</p>
              )}
            </div>
          </div>

          <button className="submit-post-button" type="submit">
            Submit Post
          </button>
        </form>
      </section>
    </div>
  );
};

export default CreatePostForm;
