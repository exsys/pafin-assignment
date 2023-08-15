import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";

// ofcourse environment variables would usually be used for some values. but for simplicity process.env isn't used here
export const postgresDataSource: DataSource = new DataSource({
    type: "postgres",
    host: "127.0.0.1",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    connectTimeoutMS: 60000,
    entities: [User],
    logging: true,
    synchronize: true,
});