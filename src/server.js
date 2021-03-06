import express from "express";
import cors from "cors";
import { errorHandler } from "./errorHandlers.js";
import mediaRouter from "./media/index.js";
import bodyParser from "body-parser";

const server = express();

console.log(server);

const port = process.env.PORT || 8080;

const whiteList = [
  process.env.FE_DEV_URL,
  process.env.FE_PROD_URL,
  "http://localhost:" + port,
  "https://strive-homework-m5-d10-frontend.vercel.app",
  "http://localhost:3000",
];
const corsOptions = {
  origin: function (origin, next) {
    if (!origin || whiteList.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error(`Origin ${origin} not allowed`));
    }
  },
};

server.use(bodyParser.json({ limit: "50mb" }));
server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
server.use(cors(corsOptions));
server.use(express.json());

server.use("/media", mediaRouter);

server.use(errorHandler);

server.listen(port, () => console.log("✅ Server is running on port : ", port));

server.on("error", (error) =>
  console.log(`❌ Server is not running due to : ${error}`)
);
