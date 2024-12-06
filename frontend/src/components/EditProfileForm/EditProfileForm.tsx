import { useCallback, useState } from "react";
import { updateUserThunk } from "../../store/slices/sessionSlice";
import { useAppDispatch } from "../../store";
import { PayloadAction } from "@reduxjs/toolkit";
import { useModal } from "../../context/useModal";
import { useDropzone } from "react-dropzone";
import "./EditProfileForm.css";

const EditProfileForm = () => {
  const dispatch = useAppDispatch();
  //image url to send to aws
  const [imgFile, setImgFile] = useState<File | null>(null);
  //telling us if we should show the image
  const [showUpload, setShowUpload] = useState(true);
  //img url we will load in react
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [aboutMe, setAboutMe] = useState<string>("");
  const [errors, setErrors] = useState({} as { serverError: string });
  const { closeModal } = useModal();

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
      <div className="drag-container flex-col" {...getRootProps()}>
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

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (imgFile) {
      formData.append("image", imgFile);
    }

    formData.append("location", location);
    formData.append("aboutMe", aboutMe);

    const updatedUser: PayloadAction<any> = await dispatch(
      updateUserThunk(formData)
    );

    if (updatedUser.payload) {
      setErrors({ serverError: updatedUser.payload.message });
    } else {
      closeModal();
    }
  };

  return (
    <form className="form-container flex-col" onSubmit={handleSubmit}>
      {errors.serverError && <p className="error-text">{errors.serverError}</p>}
      <div>
        {showUpload ? (
          <DragAndDropOneFile />
        ) : (
          <div>
            <div className="preview-img-container">
              <img className="preview-img" src={previewUrl} alt="preview" />
            </div>

            <button
              className="change-avatar-button"
              onClick={() => {
                setShowUpload(true);
                setImgFile(null);
              }}
              type="button"
            >
              Change Avatar
            </button>
          </div>
        )}
      </div>
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
      <label htmlFor="about-me">
        Tell Us About You
        <textarea
          maxLength={2000}
          onChange={(e) => {
            setAboutMe(e.target.value);
          }}
          id="about-me"
        />
      </label>

      <button type="submit">Update Profile</button>
    </form>
  );
};

export default EditProfileForm;
