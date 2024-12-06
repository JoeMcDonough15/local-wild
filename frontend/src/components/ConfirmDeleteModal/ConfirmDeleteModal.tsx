import { useState } from "react";
import { UpdateOrDeletePostArgs } from "../../types";
import { useModal } from "../../context/useModal";
import { useAppDispatch } from "../../store";
import { deletePostThunk } from "../../store/slices/postsSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";

const ConfirmDeleteModal = ({
  postId,
}: UpdateOrDeletePostArgs): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { closeModal } = useModal();
  const [errors, setErrors] = useState(
    {} as {
      serverError?: string;
    }
  );

  const deletePost = async () => {
    const deleteArgs: UpdateOrDeletePostArgs = { postId };
    const serverResponse: PayloadAction<any> = await dispatch(
      deletePostThunk(deleteArgs)
    );
    if (serverResponse.payload) {
      setErrors({ serverError: serverResponse.payload.errors.message });
    } else {
      closeModal();
      navigate("/my-posts");
    }
  };
  return (
    <section className="delete-modal flex-col">
      {errors.serverError && <p className="error-text">{errors.serverError}</p>}
      <h2>Permanently Delete This Post?</h2>
      <div className="delete-modal-button-row">
        <button
          onClick={deletePost}
          className="delete-modal-button delete-confirm"
        >
          Yes
        </button>
        <button
          onClick={closeModal}
          className="delete-modal-button delete-cancel"
        >
          No
        </button>
      </div>
    </section>
  );
};

export default ConfirmDeleteModal;
