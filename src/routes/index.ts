import express from "express";
import apiRoute from "./api";

const router = express.Router();
router
    .use("/api", apiRoute);

export default router;