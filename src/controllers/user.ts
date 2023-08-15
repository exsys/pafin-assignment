import 'dotenv/config';
import { postgresDataSource } from "../config/datasource";
import { User } from "../entity/User";
import { ResponseObject } from "../interfaces/ResponseObject";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ResponseWrapper } from '../utils/ResponseWrapper';

interface UserObject {
    name: string,
    email: string,
    password: string,
}

export class UserController {
    static async getUser(uuid: string): Promise<ResponseObject> {
        const result = await postgresDataSource.getRepository(User).findOne({
            where: { id: uuid },
            select: ["id", "name", "email"],
        });

        if (!result) return ResponseWrapper.error("Couldn't find user with given id", 404);

        return ResponseWrapper.success(result);
    }

    static async createNewUser(newUser: UserObject): Promise<ResponseObject> {
        const user = postgresDataSource.getRepository(User).create(newUser);

        try {
            const passwordHash = await bcrypt.hash(user.password, 10);
            user.password = passwordHash;
            const createdUser = await postgresDataSource.getRepository(User).save(user);

            const { id, name, email } = createdUser;
            const token = jwt.sign({ id, name, email }, (process.env.JWT_SECRET as Secret), { expiresIn: "7d" });
        
            return ResponseWrapper.created({ message: "User created successfully", id: createdUser.id, jwt: token });
        } catch (error) {
            return ResponseWrapper.error((error as Error).message);
        }
    }

    static async updateUser(uuid: string, updatedUser: any): Promise<ResponseObject> {
        try {
            const user = await this.checkIfUserExists(uuid);
            if (!user) return ResponseWrapper.error("Couldn't find user with given id", 404);
        } catch (error) {
            return ResponseWrapper.error("Server error");
        }

        try {
            await postgresDataSource.getRepository(User).update(uuid, updatedUser);
            return ResponseWrapper.success({ message: "User updated successfully" });
        } catch (error) {
            return ResponseWrapper.error("Server error");
        }
    }

    static async deleteUser(uuid: string): Promise<ResponseObject> {
        try {
            const user = await this.checkIfUserExists(uuid);
            if (!user) return ResponseWrapper.error("Couldn't find user with given id", 404);
        } catch (error) {
            return ResponseWrapper.error("Server error");
        }

        try {
            await postgresDataSource.getRepository(User).delete(uuid);
            return ResponseWrapper.ok();
        } catch (error) {
            return ResponseWrapper.error("Server error");
        }
    }

    static async checkIfUserExists(uuid: string): Promise<boolean> {
        const user = await postgresDataSource.getRepository(User).findOneBy({
            id: uuid
        });

        return user ? true : false;
    }

    /** only for simplifying the testing. this function would usually not be included ofcourse. */
    static async deleteAllUsers(): Promise<ResponseObject> {
        const userRepository = postgresDataSource.getRepository(User);

        try {
            await userRepository.createQueryBuilder().delete().execute();
            return ResponseWrapper.success({ message: "All users deleted successfully" });
        } catch (error) {
            return ResponseWrapper.error("Server error");
        }
    }
}
