import { useState } from "react";
import { updateUserThunk } from "../../store/slices/sessionSlice";
import { useAppSelector, useAppDispatch } from "../../store";

const EditProfileForm = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.session.sessionUser);

  //image url to send to aws
  const [imgFile, setImgFile] = useState<File | null>(null);
  //telling us if we should show the image
  const [showUpload, setShowUpload] = useState(true);
  //img url we will load in react
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [numYearsExperience, setNumYearsExperience] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [favoriteSubject, setFavoriteSubject] = useState<string>("");

  //function to get image from local

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

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (imgFile) {
      formData.append("image", imgFile);
    }
    formData.append("numYearsExperience", numYearsExperience);
    formData.append("location", location);
    formData.append("favoriteSubject", favoriteSubject);
    const updatedUser = await dispatch(updateUserThunk(formData));
    // handle error if returned
    // convert this to a modal
    // close modal on successful update
    // when modal closes, user sees updated profile information on the my profile page
  };

  return (
    <div>
      <h1>Edit Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          {showUpload && (
            <label htmlFor="file-upload">
              {" "}
              Select From Computer
              <input
                type="file"
                id="file-upload"
                name="img_url"
                onChange={updateImage}
                accept=".jpg, .jpeg, .png, .gif"
              />
            </label>
          )}
          {!showUpload && (
            <div>
              <img src={previewUrl} alt="preview" />
            </div>
          )}
        </div>
        <label htmlFor="num-years-experience">
          Number of Years As a Wildlife Photographer
          <input
            onChange={(e) => {
              setNumYearsExperience(e.target.value);
            }}
            type="text"
            id="num-years-experience"
          />
        </label>

        <label htmlFor="favorite-subject">
          What's your favorite wildlife to photograph?
          <input
            onChange={(e) => {
              setFavoriteSubject(e.target.value);
            }}
            type="text"
            id="favorite-subject"
          />
        </label>

        <label htmlFor="location">
          Where are you located?
          <input
            onChange={(e) => {
              setLocation(e.target.value);
            }}
            type="text"
            id="location"
          />
        </label>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default EditProfileForm;
