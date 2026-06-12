import express from "express";
import { setupRoutes } from "./routes/api";

const app = express();
const port = 3001;

app.use(express.json());

const apiRouter = express.Router();
setupRoutes(apiRouter);
app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
