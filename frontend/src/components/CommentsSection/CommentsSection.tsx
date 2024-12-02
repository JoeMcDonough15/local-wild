import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { useState } from "react";
import {
  deleteCommentThunk,
  updateCommentThunk,
} from "../../store/slices/commentsSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { CommentOnPost } from "../../types";

interface CommentProps {
  comment: CommentOnPost;
}

const Comment = ({ comment }: CommentProps) => {
  const {
    commentText,
    id,
    createdAt,
    commenterId,
    commenter: { username },
  } = comment;
  const dispatch = useAppDispatch();
  const sessionUser = useAppSelector((state) => state.session.sessionUser);
  const [editMode, setEditMode] = useState(false);
  const [updatedComment, setUpdatedComment] = useState(commentText);
  const [errors, setErrors] = useState(
    {} as {
      emptyComment?: string;
      commentTooLong?: string;
      serverError?: string;
    }
  );

  const deleteComment = () => {
    dispatch(deleteCommentThunk(id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setUpdatedComment(value);
    if (value.length === 0) {
      setErrors({ emptyComment: "Comment cannot be empty" });
      return;
    }

    if (value.length > 500) {
      setErrors({ commentTooLong: "Comment must be less than 500 characters" });
      return;
    }

    setErrors({});
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) {
      return;
    }

    const serverResponse: PayloadAction<any> = await dispatch(
      updateCommentThunk({
        commentId: id,
        commentText: updatedComment,
      })
    );

    if (serverResponse.payload?.message) {
      setErrors({ serverError: serverResponse.payload.message });
    } else {
      setEditMode(false);
    }
  };

  return (
    <>
      {editMode ? (
        <form onSubmit={handleSubmit}>
          {errors.emptyComment && (
            <p className="error-text">{errors.emptyComment}</p>
          )}
          {errors.commentTooLong && (
            <p className="error-text">{errors.commentTooLong}</p>
          )}
          <textarea value={updatedComment} onChange={handleChange}></textarea>
          <button type="submit">Update Comment</button>
          <button
            onClick={() => {
              setEditMode(false);
            }}
            type="button"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="comment-container">
          <div className="comment-first-row flex-row">
            <Link to={`/users/${commenterId}`}>{username}</Link>
            <p className="flex-row commenter-name-date">
              {createdAt.toString()}
            </p>
          </div>
          <div className="comment-second-row flex-row">
            <p className="comment-text">{commentText}</p>
            {sessionUser?.id === commenterId && (
              <div className="flex-row">
                <button
                  onClick={() => {
                    setEditMode(true);
                  }}
                  className="edit-comment-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    deleteComment();
                  }}
                  className="delete-comment-button"
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

  const sortedCommentsArray = Object.values(allComments).toSorted(
    (commentA, commentB) => {
      if (commentB.createdAt > commentA.createdAt) {
        return 1;
      }
      return -1;
    }
  );

  return (
    <div className="commentsSection">
      <h2>Comments</h2>
      {sortedCommentsArray.map((comment) => {
        return <Comment key={comment.id} comment={comment} />;
      })}
    </div>
  );
};

export default CommentsSection;
