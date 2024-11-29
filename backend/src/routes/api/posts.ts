import express, { Request, Response, NextFunction } from "express";
import { requireAuth } from "../../utils/auth.js";
import type { ApiError, NewPost } from "../../types/index.js";
import { prisma } from "../../db/database_client.js";
import { singleMulterUpload, singlePublicFileUpload } from "../../aws/index.js";
import {
  validatePostBody,
  validateEntirePost,
} from "../../utils/validation.js";

const router = express.Router();

// * get all posts (for Homepage,  UserProfilePage, and MyPostsPage)
router.get("/", async (req, res, next) => {
  let size = 3;
  let offset = 0;

  const { givenSize, slide, userId } = req.query;
  if (
    (slide && isNaN(Math.floor(Number(slide)))) ||
    (givenSize && isNaN(Math.floor(Number(givenSize)))) ||
    (userId && isNaN(Math.floor(Number(userId))))
  ) {
    const err: ApiError = {
      title: "Bad Request",
      message: "Slide number and userId must both be digits.",
      status: 400,
    };
    return next(err);
  }

  if (givenSize) {
    size = Number(givenSize);
  }
  if (slide) {
    offset = (Number(slide) - 1) * size;
  }

  const queryObj = {
    select: { imageUrl: true, title: true },
    orderBy: [{ createdAt: "desc" } as any],
    skip: offset,
    take: size,
  };

  try {
    let posts;
    let totalNumPosts;
    if (userId) {
      posts = await prisma.post.findMany({
        ...queryObj,
        where: { photographerId: Number(userId) },
      });
      const userFeatured = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: { numPosts: true },
      });
      totalNumPosts = userFeatured?.numPosts;
    } else {
      posts = await prisma.post.findMany(queryObj);
      totalNumPosts = await prisma.post.count();
    }
    res.status(200).json({ posts, totalNumPosts });
  } catch (err) {
    next(err);
  }
});

// * get a single post's details by id
router.get("/:id", requireAuth, async (req, res, next) => {
  const { id } = req.params;
  if (isNaN(Math.floor(Number(id)))) {
    const err: ApiError = {
      title: "Bad Request",
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
        comments: { include: { replies: true } },
      },
    });

    if (!post) {
      const userNotFound: ApiError = {
        message: "This post could not be found",
        status: 404,
      };
      return next(userNotFound);
    }

    res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
});

// * create a new post
router.post(
  "/",
  requireAuth,
  singleMulterUpload("image"),
  validateEntirePost,
  async (req, res, next) => {
    const id = req.user?.id;
    const imageFile = req.file;
    const {
      title,
      caption,
      fullDescription,
      lat,
      lng,
      partOfDay,
      datePhotographed,
    } = req.body;
    if (!imageFile || !id || !title) {
      return; // errors should have already been thrown by this point by requireAuth or validateEntirePost
    }
    try {
      const imageUrl = await singlePublicFileUpload(imageFile);
      const postObj: NewPost = {
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
      await prisma.user.update({
        where: { id },
        data: { numPosts: { increment: 1 } },
      });

      res.status(201).json({ post });
    } catch (err) {
      next(err);
    }
  }
);

// * update a post (not changing the image)
router.put(
  "/:id",
  requireAuth,
  validatePostBody,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId || !id) {
      return;
    }

    const { caption, fullDescription, lat, lng, partOfDay, datePhotographed } =
      req.body;
    try {
      const postToUpdate = await prisma.post.update({
        // @ts-expect-error: where should be ok??
        where: {
          AND: [
            {
              id: {
                equals: Number(id),
              },
            },
            {
              photographerId: {
                equals: userId,
              },
            },
          ],
        },
        data: {
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
      res.status(200).json({ postToUpdate });
    } catch (err) {
      next(err);
    }
  }
);

// * delete a post
router.delete("/:id", requireAuth, async (req, res, next) => {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId || !id) {
    return;
  }
  try {
    await prisma.post.delete({
      // @ts-expect-error: where should be ok??
      where: { AND: [{ id: Number(id) }, { photographerId: userId }] },
    });
    await prisma.user.update({
      where: { id: userId },
      data: { numPosts: { decrement: 1 } },
    });
    res.status(200).json({ message: "Your post has been deleted." });
  } catch (err) {
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
