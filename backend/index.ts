import express, { Application } from "express";
import cors from "cors";
import { PORT } from "./src/config/envConfig"
import scrapeRoutes from "./src/routes/scrapeRoutes";
import errorHandler from "./src/middlewares/errorHandler";

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/scrape", scrapeRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
