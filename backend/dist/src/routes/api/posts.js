import express from "express";
import { requireAuth } from "../../utils/auth.js";
import { prisma } from "../../db/database_client.js";
const router = express.Router();
// * get all posts (for homepage MVP and for user profiles)
router.get("/", (req, res, next) => {
    const size = 3;
    let offset = 0;
    const { slide, userId } = req.query;
    if ((slide && isNaN(Math.floor(Number(slide)))) ||
        (userId && isNaN(Math.floor(Number(userId))))) {
        const err = {
            title: "Bad Request",
            message: "Slide number and userId must both be digits.",
            status: 400,
        };
        return next(err);
    }
    if (slide) {
        offset = (Number(slide) - 1) * size;
    }
    const queryObj = {
        select: { imageUrl: true, title: true },
        orderBy: [{ createdAt: "desc" }],
        skip: offset,
        take: size,
    };
    try {
        let posts;
        if (userId) {
            posts = prisma.post.findMany({
                ...queryObj,
                where: { photographerId: Number(userId) },
            });
        }
        else {
            posts = prisma.post.findMany(queryObj);
        }
        res.status(200).json({ posts });
    }
    catch (err) {
        next(err);
    }
});
// * get a single post's details by id
router.get("/:id", requireAuth, (req, res, next) => {
    const { id } = req.params;
    if (isNaN(Math.floor(Number(id)))) {
        const err = {
            title: "Bad Request",
            message: "id must be a digit.",
            status: 400,
        };
        return next(err);
    }
    const post = prisma.post.findUnique({
        where: { id: Number(id) },
        include: {
            photographer: { select: { id: true, username: true } },
            comments: { include: { replies: true } },
        },
    });
    if (!post) {
        const userNotFound = {
            message: "This post could not be found",
            status: 404,
        };
        return next(userNotFound);
    }
    res.status(200).json({ post });
});
// * create a new post
// * requireAuth
// 1. do a query to create a new post - create
// 2. use the req.user to associate the new post with that user
// 3. implement aws to upload the photo that belongs to the post and use the returned url as the post's imageUrl
// * update a post (not changing the image)
// * requireAuth and requireAuthorization
// 1. similar to the update user route
// * delete a post
// * requireAuth and requireAuthorization
// 1. do a query to delete the post - delete
//
//
//
export default router;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// ? get all posts that are closest to the user's location - for the eventual homepage
// 1. we'd have to know the user's location
// 2. we'd have to only pull records of posts that include lat/lng, since these are optional fields
// 3. we'd have to only pull records of posts whose lat/lng were within a certain min/max that corresponded to the user's lat/lng, derived from their location
// * So we'd either need some input to come into the request that would include the user's lat/lng
// *    - we could check to see if there's a user on the request object.
// *    - we could modify the user object to include lat/lng from their current location
// * or we could use query params for minLat, minLng, maxLat, and maxLng that are derived from the user's current location
// *    - we could grab the values from the query params and use those in the query
