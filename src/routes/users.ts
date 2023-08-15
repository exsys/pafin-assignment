import 'dotenv/config';
import express, { Router, Response, NextFunction } from 'express';
import { UserController } from "../controllers/user";
import { validationResult, Result, ValidationError, matchedData } from 'express-validator';
import { expressjwt, Request, UnauthorizedError } from "express-jwt";
import { Secret } from 'jsonwebtoken';
import { ResponseObject } from '../interfaces/ResponseObject';
import { isValidUuid, isValidUserObject, isValidUpdateObject, emailAlreadyUsed } from '../middlewares/validations';

const router: Router = express.Router();

const handleJwtError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof UnauthorizedError) {
        res.status(401).json({ success: false, status: 401, data: { error: 'Not authorized' } });
    } else {
        next(err);
    }
};

router.post(
    "/",
    isValidUserObject(),
    emailAlreadyUsed(),
    async (req: Request, res: Response) => {
        const valResult: Result = validationResult(req);
        if (!valResult.isEmpty()) {
            const errors: ValidationError[] = validationResult(req).array();
            return res.status(400).json({ errors: errors });
        }

        const result: ResponseObject = await UserController.createNewUser(req.body.user);
        res.status(result.status).json(result);
    }
);

router.get(
    "/:id",
    isValidUuid(),
    expressjwt({ secret: process.env.JWT_SECRET as Secret, algorithms: ["HS256"] }),
    handleJwtError,
    async (req: Request, res: Response) => {
        const valResult: Result = validationResult(req);
        if (!valResult.isEmpty()) {
            const errors: ValidationError[] = validationResult(req).array();
            return res.status(400).json({ errors: errors });
        }

        if (!req.auth?.id) return res.status(401).json({ success: false, status: 401, data: { error: "Not authorized" } });

        const result: ResponseObject = await UserController.getUser(req.params.id as string);
        res.status(result.status).json(result);
    }
);

router.put(
    "/:id",
    isValidUuid(),
    isValidUpdateObject(),
    expressjwt({ secret: process.env.JWT_SECRET as Secret, algorithms: ["HS256"] }),
    handleJwtError,
    async (req: Request, res: Response) => {
        const valResult: Result = validationResult(req);
        if (!valResult.isEmpty()) {
            const errors: ValidationError[] = validationResult(req).array();
            return res.status(400).json({ errors: errors });
        }

        const validatedData = matchedData(req);
        if (!req.auth?.id || req.auth?.id !== validatedData.id) {
            return res.status(401).json({ success: false, status: 401, data: { error: "Not authorized" } });
        }

        const result: ResponseObject = await UserController.updateUser(validatedData.id, req.body.user);
        res.status(result.status).json(result);
    }
);

router.delete(
    "/:id",
    isValidUuid(),
    expressjwt({ secret: process.env.JWT_SECRET as Secret, algorithms: ["HS256"] }),
    handleJwtError,
    async (req: Request, res: Response) => {
        const valResult: Result = validationResult(req);
        if (!valResult.isEmpty()) {
            const errors: ValidationError[] = validationResult(req).array();
            return res.status(400).json({ errors: errors });
        }

        const validatedData = matchedData(req);
        if (!req.auth?.id || req.auth?.id !== validatedData.id) {
            return res.status(401).json({ success: false, status: 401, data: { error: "Not authorized" } });
        }

        const result: ResponseObject = await UserController.deleteUser(validatedData.id);
        res.status(result.status).json(result);
    }
);

/** only for simplifying the testing. this route would usually not be included ofcourse. */
router.delete("/", async (req: Request, res: Response) => {
    const result: ResponseObject = await UserController.deleteAllUsers();
    res.status(result.status).json(result);
});

export default router;