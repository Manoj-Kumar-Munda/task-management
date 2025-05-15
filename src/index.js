import "./config/env.js";
import connectDB from "./db/index.js";
import app from "./app.js";

const PORT = process.env.PORT || 8000;

console.log("PORT:", process.env.PORT);
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
    process.exit(1);
  });
