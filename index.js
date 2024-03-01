import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors'
import routes from "./routes/index.js"
import morgan from "morgan"

const app = express()
const PORT = 5000

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());
app.use(morgan('dev'));

app.use("/api", routes)

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
})