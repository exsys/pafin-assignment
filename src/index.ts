import app from "./config/server";
import { postgresDataSource } from "./config/datasource";
import allRoutes from "./routes/index";

const PORT: number = Number(process.env.PORT) || 3000;

postgresDataSource
    .initialize()
    .then(() => console.log("Data source has been initialized."))
    .catch((err) => console.error("Error during data source initialization: ", err));

app.use("/", allRoutes);

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));