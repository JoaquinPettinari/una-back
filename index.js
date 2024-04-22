import express from "express";
import bodyparser from "body-parser";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();
const PORT = 4001;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
