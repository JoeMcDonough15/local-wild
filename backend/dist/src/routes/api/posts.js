import express from "express";
import { requireAuth } from "../../utils/auth.js";
import { prisma } from "../../db/database_client.js";
import { singleMulterUpload, singlePublicFileUpload } from "../../aws/index.js";
import { validatePostBody, checkForImage } from "../../utils/validation.js";
import calculateDistance from "../../utils/sortByClosest.js";
const router = express.Router();
// * get all posts (for Homepage,  UserProfilePage, and MyPostsPage)
router.get("/", async (req, res, next) => {
    const { userId, userLat, userLng } = req.query;
    if ((userId && isNaN(Math.floor(Number(userId)))) ||
        (userLat !== undefined && isNaN(Number(userLat))) ||
        (userLng !== undefined && isNaN(Number(userLng)))) {
        const err = {
            name: "Bad Request Error",
            message: "All query params must be numbers.",
            status: 400,
        };
        return next(err);
    }
    const postsByUserQuery = {
        orderBy: [{ createdAt: "desc" }],
        where: { photographerId: Number(userId) },
    };
    try {
        let posts;
        if (userId) {
            posts = await prisma.post.findMany(postsByUserQuery);
        }
        else {
            posts = await prisma.post.findMany(); // return all of the posts
            if (userLat && userLng) {
                posts.sort((postA, postB) => {
                    const userLatAsNum = Number(userLat);
                    const userLngAsNum = Number(userLng);
                    // if one post has lat/lng and another does not, put the one that does first
                    if (postA.lat !== null &&
                        postA.lng !== null &&
                        postB.lat === null &&
                        postB.lng === null) {
                        return -1;
                    }
                    if (postB.lat !== null &&
                        postB.lng !== null &&
                        postA.lat === null &&
                        postA.lng === null) {
                        return 1;
                    }
                    if (postA.lat !== null &&
                        postA.lng !== null &&
                        postB.lat !== null &&
                        postB.lng !== null) {
                        return (
                        // if both posts have lat/lng, calculate the distance from the user's lat/lng and put shortest distances first
                        calculateDistance(userLatAsNum, userLngAsNum, Number(postA.lat), Number(postA.lng)) -
                            calculateDistance(userLatAsNum, userLngAsNum, Number(postB.lat), Number(postB.lng)));
                    }
                    // if neither post has lat/lng, leave them in the order they're in
                    return 0;
                });
            }
        }
        res.status(200).json({ posts });
    }
    catch (err) {
        next(err);
    }
});
// * get a single post's details by id
router.get("/:id", requireAuth, async (req, res, next) => {
    const { id } = req.params;
    if (isNaN(Math.floor(Number(id)))) {
        const err = {
            name: "Bad Request Error",
            message: "id must be a digit.",
            status: 400,
        };
        return next(err);
    }
    try {
        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
            include: {
                photographer: { select: { id: true, username: true } },
                comments: {
                    orderBy: { createdAt: "asc" },
                    include: {
                        replies: { orderBy: { createdAt: "asc" } },
                        commenter: { select: { username: true, id: true } },
                    },
                },
            },
        });
        if (!post) {
            const postNotFound = {
                name: "Not Found Error",
                message: "This post could not be found",
                status: 404,
            };
            return next(postNotFound);
        }
        res.status(200).json({ post });
    }
    catch (err) {
        next(err);
    }
});
// * create a new post
router.post("/", requireAuth, singleMulterUpload("image"), checkForImage, validatePostBody, async (req, res, next) => {
    const id = req.user?.id;
    const imageFile = req.file;
    const { title, caption, fullDescription, lat, lng, partOfDay, datePhotographed, } = req.body;
    if (!imageFile || !id || !title) {
        return; // errors should have already been thrown by this point by middlewares
    }
    try {
        const imageUrl = await singlePublicFileUpload(imageFile);
        const postObj = {
            title,
            photographerId: id,
            imageUrl,
        };
        if (caption) {
            postObj.caption = caption;
        }
        if (fullDescription) {
            postObj.fullDescription = fullDescription;
        }
        if (lat !== undefined && lng !== undefined) {
            postObj.lat = lat;
            postObj.lng = lng;
        }
        if (partOfDay) {
            postObj.partOfDay = partOfDay;
        }
        if (datePhotographed) {
            postObj.datePhotographed = new Date(datePhotographed);
        }
        const post = await prisma.post.create({ data: postObj });
        res.status(201).json({ post });
    }
    catch (err) {
        next(err);
    }
});
// * update a post (not changing the image)
router.put("/:id", requireAuth, validatePostBody, async (req, res, next) => {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId || !id) {
        return;
    }
    const { title, caption, fullDescription, lat, lng, partOfDay, datePhotographed, } = req.body;
    try {
        const postToUpdate = await prisma.post.update({
            where: {
                id: Number(id),
                photographerId: userId,
            },
            data: {
                title,
                caption: caption ?? null,
                partOfDay: partOfDay ?? null,
                datePhotographed: datePhotographed
                    ? new Date(datePhotographed)
                    : null,
                lat: lat !== undefined && lng !== undefined ? lat : null,
                lng: lng !== undefined && lat !== undefined ? lng : null,
                fullDescription: fullDescription ?? null,
                updatedAt: new Date(),
            },
        });
        res.status(200).json({ post: postToUpdate });
    }
    catch (err) {
        next(err);
    }
});
// * delete a post
router.delete("/:id", requireAuth, async (req, res, next) => {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId || !id) {
        return;
    }
    try {
        await prisma.post.delete({
            where: { id: Number(id), photographerId: userId },
        });
        res.status(200).json({ message: "Your post has been deleted." });
    }
    catch (err) {
        next(err);
    }
});
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
