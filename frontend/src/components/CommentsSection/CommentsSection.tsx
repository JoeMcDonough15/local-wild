import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { useState } from "react";
import {
  createCommentThunk,
  deleteCommentThunk,
  updateCommentThunk,
} from "../../store/slices/commentsSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { CommentOnPost } from "../../types";
import "./CommentsSection.css";
import { formattedDate } from "../../utils/formatter";

const emptyCommentErrorMessage = "Comment cannot be empty";
const commentTooLongErrorMessage = "Comment must be less than 500 characters";

interface CommentProps {
  comment: CommentOnPost;
}

interface CommentFormProps {
  existingCommentToEdit?: CommentOnPost;
  setActiveCommentState: (arg: boolean) => void;
}

const CommentForm = ({
  existingCommentToEdit,
  setActiveCommentState,
}: CommentFormProps) => {
  const dispatch = useAppDispatch();
  const currentPost = useAppSelector((state) => state.posts.currentPost);
  const [commentText, setCommentText] = useState<string>(
    existingCommentToEdit?.commentText ?? ""
  );
  const [errors, setErrors] = useState(
    {} as {
      emptyComment?: string;
      commentTooLong?: string;
      serverError?: string;
    }
  );

  const clientSideErrors = (inputValue: string) => {
    if (inputValue.length === 0) {
      setErrors({ emptyComment: emptyCommentErrorMessage });
      return true;
    }

    if (inputValue.length > 500) {
      setErrors({
        commentTooLong: commentTooLongErrorMessage,
      });
      return true;
    }

    return false;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCommentText(value);
    setErrors({});
    clientSideErrors(value);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const userErrors = clientSideErrors(commentText);
    if (userErrors) {
      return;
    }

    let serverResponse: PayloadAction<any> = { payload: {}, type: "" };

    if (commentText && currentPost) {
      serverResponse = await dispatch(
        createCommentThunk({
          commentText,
          postId: currentPost?.id,
        })
      );
    } else if (commentText && existingCommentToEdit) {
      serverResponse = await dispatch(
        updateCommentThunk({
          commentId: existingCommentToEdit.id,
          commentText,
        })
      );
    }

    if (serverResponse.payload?.message) {
      setErrors({ serverError: serverResponse.payload.message });
    } else {
      setActiveCommentState(false);
    }
  };

  return (
    <form className="comment-form-container flex-row" onSubmit={handleSubmit}>
      <div className="comment-input-container flex-col">
        {errors.emptyComment && (
          <p className="error-text">{errors.emptyComment}</p>
        )}
        {errors.commentTooLong && (
          <p className="error-text">{errors.commentTooLong}</p>
        )}
        <textarea
          className="comment-input"
          value={commentText}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="comment-buttons flex-row">
        <button className="comment-button" type="submit">{`${
          existingCommentToEdit ? "Update" : "Submit"
        }`}</button>
        <button
          onClick={() => {
            setActiveCommentState(false);
          }}
          type="button"
          className="comment-button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const Comment = ({ comment }: CommentProps) => {
  const {
    commentText,
    id,
    createdAt,
    commenterId,
    commenter: { name },
  } = comment;
  const dispatch = useAppDispatch();
  const sessionUser = useAppSelector((state) => state.session.sessionUser);
  const [editMode, setEditMode] = useState(false);

  const deleteComment = () => {
    dispatch(deleteCommentThunk(id));
  };

  return (
    <>
      {editMode ? (
        <CommentForm
          existingCommentToEdit={comment}
          setActiveCommentState={setEditMode}
        />
      ) : (
        <div className="comment-container flex-col">
          <div className="comment-first-row flex-row">
            <Link className="link-to-photographer" to={`/users/${commenterId}`}>
              {name}
            </Link>
            <p className="flex-row commenter-name-date">
              {formattedDate(createdAt)}
            </p>
          </div>
          <div className="comment-second-row flex-row">
            <p className="comment-text">{commentText}</p>
            {sessionUser?.id === commenterId && (
              <div className="comment-buttons flex-row">
                <button
                  onClick={() => {
                    setEditMode(true);
                  }}
                  className="comment-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    deleteComment();
                  }}
                  className="comment-button"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const CommentsSection = () => {
  const allComments = useAppSelector((state) => state.comments.allComments);
  const sessionUser = useAppSelector((state) => state.session.sessionUser);
  const currentPost = useAppSelector((state) => state.posts.currentPost);
  const [createCommentMode, setCreateCommentMode] = useState(false);

  const sortedCommentsArray = Object.values(allComments).toSorted(
    (commentA, commentB) => {
      if (commentB.createdAt > commentA.createdAt) {
        return 1;
      }
      return -1;
    }
  );

  return (
    <div className="comments-section flex-col">
      {createCommentMode && (
        <CommentForm setActiveCommentState={setCreateCommentMode} />
      )}

      <div className="existing-comments flex-col">
        <div className="title-and-create-button flex-row">
          <h2>
            {`${
              sortedCommentsArray.length > 0 ? "Comments" : "No comments yet."
            }`}
          </h2>
          {sessionUser?.id !== currentPost?.photographerId &&
            !createCommentMode && (
              <button
                onClick={() => {
                  setCreateCommentMode(true);
                }}
                type="button"
                className="comment-button"
              >
                Leave a comment
              </button>
            )}
        </div>
        {sortedCommentsArray.length > 0 && (
          <>
            {sortedCommentsArray.map((comment) => {
              return <Comment key={comment.id} comment={comment} />;
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
