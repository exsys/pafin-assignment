import { param, body } from 'express-validator';
import { postgresDataSource } from '../config/datasource';
import { User } from '../entity/User';

export const isValidUuid = () => param("id").isUUID().withMessage("Invalid UUID format");
export const isValidUserObject = () => [
    body("user").isObject().withMessage("Invalid user object"),
    body("user.name")
        .notEmpty().withMessage("Name is required")
        .isString().withMessage("Not a valid name")
        .matches(/.*\S.*/).withMessage("Not a valid name"),
    body("user.email").isEmail().withMessage("Not a valid Email address"),
    body("user.password")
        .notEmpty().withMessage("Password is required")
        .isString().withMessage("Not a valid password")
        .matches(/^\S*$/).withMessage('Password cannot contain white spaces')
        .isLength({ min: 8 }).withMessage("Password must contain at least 8 characters"),
];
export const isValidUpdateObject = () => [
    body("user").custom(user => {
        if (!user) throw new Error("Invalid user object");
        if (!user.name && !user.email && !user.password) throw new Error("At least one field has to be set");
        return true;
    }),
    body("user.name")
        .optional()
        .notEmpty().withMessage("Empty names are not allowed")
        .isString().withMessage("Not a valid name"),
    body("user.email")
        .optional()
        .isEmail().withMessage("Not a valid Email address"),
    body("user.password")
        .optional()
        .notEmpty().withMessage("Password is required")
        .isString().withMessage("Not a valid password")
        .matches(/^\S*$/).withMessage('Password cannot contain white spaces')
        .isLength({ min: 8 }).withMessage("Password must contain at least 8 characters"),
];

export const emailAlreadyUsed = () => body("user.email").custom(async email => {
    const user = await postgresDataSource.getRepository(User).findOneBy({
        email: email
    });

    if (user) {
        throw new Error("E-mail already in use");
    }
});