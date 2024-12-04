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
    <form onSubmit={handleSubmit}>
      {errors.emptyComment && (
        <p className="error-text">{errors.emptyComment}</p>
      )}
      {errors.commentTooLong && (
        <p className="error-text">{errors.commentTooLong}</p>
      )}
      <textarea value={commentText} onChange={handleChange}></textarea>
      <button type="submit">{`${
        existingCommentToEdit ? "Update" : "Submit"
      } Comment`}</button>
      <button
        onClick={() => {
          setActiveCommentState(false);
        }}
        type="button"
      >
        Cancel
      </button>
    </form>
  );
};

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

  const deleteComment = () => {
    dispatch(deleteCommentThunk(id));
  };

  return (
    <>
      {editMode ? (
        <CommentForm setActiveCommentState={setEditMode} />
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
    <>
      {createCommentMode ? (
        <CommentForm setActiveCommentState={setCreateCommentMode} />
      ) : (
        <div className="commentsSection">
          <div className="title-and-create-button">
            <h2>Comments</h2>
            {sessionUser?.id !== currentPost?.photographerId && (
              <button
                onClick={() => {
                  setCreateCommentMode(true);
                }}
                type="button"
              >
                Leave a comment
              </button>
            )}
          </div>

          {sortedCommentsArray.map((comment) => {
            return <Comment key={comment.id} comment={comment} />;
          })}
        </div>
      )}
    </>
  );
};

export default CommentsSection;
