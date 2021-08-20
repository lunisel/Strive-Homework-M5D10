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

export default mediaRouter;
