import express from "express";
import { requireAuth } from "../../utils/auth.js";
import type { ApiError } from "../../types/index.js";
import { prisma } from "../../db/database_client.js";
// optional validator for comments?

const router = express.Router();

// route to create a new comment
router.post("/", requireAuth, async (req, res, next) => {
  const commenterId = req.user?.id;
  const { postId, commentText } = req.body;
  if (!commenterId || !postId) return;
  const postToCommentOn = await prisma.post.findUnique({
    where: { id: Number(postId) },
    select: { photographerId: true },
  });

  if (!postToCommentOn) {
    const postNotFound: ApiError = {
      name: "Not Found Error",
      message: "Post not found.",
      status: 404,
      errors: { postNotFoundError: "This post could not be found" },
    };
    return next(postNotFound);
  }

  if (postToCommentOn.photographerId === commenterId) {
    const notAllowedToComment: ApiError = {
      name: "Unauthorized Comment Error",
      message: "You cannot comment on a post you created.",
      status: 400,
    };
    return next(notAllowedToComment);
  }

  if (commentText.length > 150) {
    const commentTooLong: ApiError = {
      name: "Comment Too Long Error",
      message: "Comments must be 150 characters or less.",
      status: 400,
    };
    return next(commentTooLong);
  }

  try {
    const comment = await prisma.commentOnPost.create({
      data: { ...req.body, commenterId },
      include: { commenter: true },
    });
    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
});

// route to update a comment by id
router.put("/:id", requireAuth, async (req, res, next) => {
  const { id } = req.params;
  const { commentText } = req.body;
  const userId = req.user?.id;
  if (id && isNaN(Math.floor(Number(id)))) {
    const err: ApiError = {
      name: "Bad Request",
      message: "comment id must be a digit.",
      status: 400,
    };
    return next(err);
  }
  if (commentText.length > 150) {
    const commentTooLong: ApiError = {
      name: "Comment Too Long Error",
      message: "Comments must be 150 characters or less.",
      status: 400,
    };
    return next(commentTooLong);
  }

  try {
    if (id && userId && commentText) {
      const comment = await prisma.commentOnPost.update({
        where: { id: Number(id), commenterId: userId },
        data: { commentText, updatedAt: new Date() },
        include: {
          replies: { orderBy: { createdAt: "asc" } },
          commenter: { select: { username: true, id: true } },
        },
      });

      if (!comment) {
        const err: ApiError = {
          name: "Not Found or Unauthorized",
          message:
            "This comment either does not exist or you are not authorized to modify it.",
          status: 400,
        };
        return next(err);
      }

      res.status(200).json({ comment });
    }
  } catch (err) {
    return next(err);
  }
});

// route to delete a comment by id
router.delete("/:id", requireAuth, async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user?.id;
  if (id && isNaN(Math.floor(Number(id)))) {
    const err: ApiError = {
      name: "Bad Request",
      message: "comment id must be a digit.",
      status: 400,
    };
    return next(err);
  }

  try {
    if (id && userId) {
      const comment = await prisma.commentOnPost.delete({
        where: { id: Number(id), commenterId: userId },
      });

      if (!comment) {
        const err: ApiError = {
          name: "Not Found or Unauthorized",
          message:
            "This comment either does not exist or you are not authorized to modify it.",
          status: 400,
        };
        return next(err);
      }

      res
        .status(200)
        .json({ message: "Your comment has been successfully deleted." });
    }
  } catch (err) {
    return next(err);
  }
});

export default router;
