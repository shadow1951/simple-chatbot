import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";
import morgan from "morgan";
import router from "./routes/index.mjs";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

dotenv.config();
// Setup the logger to log to a file
app.use(morgan("combined", { stream: accessLogStream }));

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
