import express from "express";
import { requireAuth } from "../../utils/auth.js";
import { prisma } from "../../db/database_client.js";
// optional validator for comments?
const router = express.Router();
// route to create a new comment
router.post("/", requireAuth, async (req, res, next) => {
    const commenterId = req.user?.id;
    const { postId, commentText } = req.body;
    if (!commenterId || !postId)
        return;
    const postToCommentOn = await prisma.post.findUnique({
        where: { id: Number(postId) },
        select: { photographerId: true },
    });
    if (!postToCommentOn) {
        const postNotFound = {
            message: "Post not found.",
            status: 404,
            errors: { postNotFoundError: "This post could not be found" },
        };
        return next(postNotFound);
    }
    if (postToCommentOn.photographerId === commenterId) {
        const notAllowedToComment = {
            message: "You cannot comment on a post you created.",
            status: 400,
        };
        return next(notAllowedToComment);
    }
    if (commentText.length > 150) {
        const commentTooLong = {
            message: "Comments must be 150 characters or less.",
            status: 400,
        };
        return next(commentTooLong);
    }
    try {
        const comment = await prisma.commentOnPost.create({
            data: { ...req.body, commenterId },
        });
        res.status(201).json({ comment });
    }
    catch (err) {
        next(err);
    }
});
// route to update a comment by id
router.put("/:id", requireAuth, async (req, res, next) => {
    const { id } = req.params;
    const { commentText } = req.body;
    const userId = req.user?.id;
    if (id && isNaN(Math.floor(Number(id)))) {
        const err = {
            title: "Bad Request",
            message: "comment id must be a digit.",
            status: 400,
        };
        return next(err);
    }
    if (commentText.length > 150) {
        const commentTooLong = {
            message: "Comments must be 150 characters or less.",
            status: 400,
        };
        return next(commentTooLong);
    }
    try {
        if (id && userId && commentText) {
            const comment = await prisma.commentOnPost.update({
                where: { id: Number(id), commenterId: userId },
                data: { commentText },
            });
            console.log("updated comment: ", comment);
            res.status(200).json({ comment });
        }
    }
    catch (err) {
        return next(err);
    }
});
// route to delete a comment by id
export default router;
