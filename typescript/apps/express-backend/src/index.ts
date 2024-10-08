import express from "express";
import cors from "cors";
import {
  createTables,
  getAllPublicTablesList,
  initializePool,
} from "@packages/express-postgres-db";

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  const data = {
    prop1: "test",
    prop2: 0,
  };

  res.send(data);
});

app.listen(3002, async () => {
  console.log("Listening on port 3002");

  const host = "express-backend-postgresql";
  const port = 5432;
  const user = process.env.POSTGRES_USER ?? "";
  const password = process.env.POSTGRES_PASSWORD ?? "";
  const database = process.env.POSTGRES_DB ?? "";

  const pool = initializePool({ host, port, user, password, database });
  await createTables({ pool });
  const res = await getAllPublicTablesList({ pool });
  console.log(res);
});
