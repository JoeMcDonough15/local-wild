import express from "express";
import { prisma } from "../../db/database_client.js";
const getAllPosts = (req, res, next, id = null) => {
    const { slide } = req.query;
    if (slide && isNaN(Math.floor(Number(slide)))) {
        const err = {
            title: "Bad Request",
            message: `${slide} is not a digit`,
            status: 400,
        };
        return next(err);
    }
    const size = 3;
    const offset = (Number(slide) - 1) * size;
    try {
        let posts;
        if (id) {
            posts = prisma.post.findMany({
                where: { photographerId: id },
                orderBy: [{ createdAt: "desc" }],
                select: { imageUrl: true, title: true },
                skip: offset,
                take: size,
            });
        }
        else {
            posts = prisma.post.findMany({
                orderBy: [{ createdAt: "desc" }],
                select: { imageUrl: true, title: true },
                skip: offset,
                take: size,
            });
        }
        res.status(200).json({ posts });
    }
    catch (err) {
        next(err);
    }
};
const router = express.Router();
// * get all posts
// ? get all posts - homepage MVP
router.get("/", (req, res, next) => {
    getAllPosts(req, res, next);
});
// ? get all posts by a single user - for when viewing a user's profile
router.get("/:id", (req, res, next) => {
    const { id } = req.params;
    const postId = Number(id);
    getAllPosts(req, res, next, postId);
});
// * get a single post's details by id
// ? for a post's details page
// * requireAuth?
// 1. do a query for a single post by id - findUnique()
// 2. decide if there are any fields that we don't want to include
// 3. associate the user's details with the query
// *    - username and id I think.  We'd want to put the username of the user who took the photo on the details page
// *    - and we would want the id so if the person viewing the post details page clicks the username, they can link to that user's profile
// 4. associate any comments that belong to the post
// *    - these would be listed under the post like the wireframe
// 5. associate any comment replies that belong to each comment
// *    - these would be listed under each comment like the wireframe
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
