import dotenv from "dotenv";
dotenv.config();
import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import generateRoutes from "./src/routes/generate.routes.js"

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/storage",(_,res,next)=> {
  storageRoutes(_,res,next)
});

app.use("/generate",(req,res,next)=> {
  generateRoutes(req,res,next)
});

app.get("/", (_, res, next) => {
  return res.status(200).json({
    message: "Hi from the root of the lambda!",
  });
});

app.get("/healthcheck", (_, res, next) => {
  return res.status(200).json({
    message: "OK",
  });
});



app.get("/hello", (_, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

// only for local testing
if(process.env.NODE_ENV !== "production"){
  app.listen(4000, () => {
    console.log("Server is running on port 4000");
  });
}

export const handler = serverless(app);
