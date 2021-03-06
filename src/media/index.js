import express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { getMedia, writeMedia } from "../../lib/fs-tools.js";

const mediaRouter = express.Router();

mediaRouter.get("/", async (req, resp, next) => {
  try {
    const media = await getMedia();
    if (req.query && req.query.Title) {
      const filteredMedia = media.filter((m) => m.Title === req.query.Title);
      resp.send(filteredMedia);
    } else {
      console.log(media);
      resp.send(media);
    }
  } catch (err) {
    next(err);
  }
});

mediaRouter.get("/:imdbID", async (req, resp, next) => {
  try {
    const media = await getMedia();
    const singleMedia = media.find((m) => m.imdbID === req.params.imdbID);
    if (singleMedia) {
      resp.send(singleMedia);
    } else {
      next(
        createHttpError(404, `Media with id ${req.params.imdbID} not found!`)
      );
    }
  } catch (err) {
    next(err);
  }
});

mediaRouter.post("/", async (req, resp, next) => {
  try {
    const media = await getMedia();
    const newMedia = { ...req.body, imdbID: uniqid(), Reviews: [] };
    media.push(newMedia);
    await writeMedia(media);
    resp.status(201).send(newMedia);
  } catch (err) {
    next(err);
  }
});

mediaRouter.put("/:imdbID", async (req, resp, next) => {
  try {
    const media = await getMedia();
    const remainingMedia = media.filter((m) => m.imdbID !== req.params.imdbID);
    const modifiedMedia = { ...req.body, imdbID: req.params.imdbID };
    remainingMedia.push(modifiedMedia);
    await writeMedia(remainingMedia);
    resp.send(modifiedMedia);
  } catch (err) {
    next(err);
  }
});

mediaRouter.delete("/:imdbID", async (req, resp, next) => {
  try {
    const media = await getMedia();
    const remainingMedia = media.filter((m) => m.imdbID !== req.params.imdbID);
    await writeMedia(remainingMedia);
    resp.status(204).send();
  } catch (err) {
    next(err);
  }
});

/* mediaRouter.post("/:imdbID/poster", async (req, resp, next) => {
  try {
    const fileString = req.body.data;
    const 
  } catch (err) {
    next(err);
  }
}); */

mediaRouter.post("/:imdbID/reviews", async (req, resp, next) => {
  try {
    const media = await getMedia();
    const remainingMedia = media.filter((m) => m.imdbID !== req.params.imdbID);
    const singleMedia = media.find((m) => m.imdbID === req.params.imdbID);
    const reviews = singleMedia.Reviews;
    const newMedia = {
      ...singleMedia,
      Reviews: [
        ...reviews,
        {
          ...req.body,
          _id: uniqid(),
          elementId: req.params.imdbID,
          createdAt: new Date(),
        },
      ],
    };

    remainingMedia.push(newMedia);
    await writeMedia(remainingMedia);
    resp.send(newMedia.Reviews);
  } catch (err) {
    next(err);
  }
});

mediaRouter.delete("/:imdbID/reviews/:_id", async (req, resp, next) => {
  try {
    const media = await getMedia();
    const remainingMedia = media.filter((m) => m.imdbID !== req.params.imdbID);
    const singleMedia = media.find((m) => m.imdbID === req.params.imdbID);
    const reviews = singleMedia.Reviews;
    const remainingReviews = reviews.filter((r) => r._id !== req.params._id);
    const newMedia = {
      ...singleMedia,
      Reviews: [...remainingReviews],
    };
    remainingMedia.push(newMedia);
    await writeMedia(remainingMedia);
    resp.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default mediaRouter;
