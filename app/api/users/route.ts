import { type NextRequest } from "next/server";
import { Database, OPEN_CREATE, OPEN_READWRITE } from "sqlite3";
import { open } from "sqlite";
import { User, UserSchema } from "@/db/schema";
// // Initialize a variable to hold the SQLite database connection
// let db = null as any;

// Handler for GET requests to retrieve all todos
export async function GET(request: NextRequest) {
  const db = await open({
    filename: "./db/users.db",
    driver: require("sqlite3").Database,
  });

  await db.exec(UserSchema);

  const users = await db.all("SELECT * FROM users");

  return new Response(JSON.stringify(users), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = body as Omit<User, "timestamp">;

  const db = await open({
    filename: "./db/users.db",
    driver: require("sqlite3").Database,
  });

  await db.exec(UserSchema);

  // SQL command for insertion
  const insertSql = `INSERT INTO users (username, profilePic, bio, shippingAddress, password) VALUES (?, ?, ?, ?, ?)`;

  // Execute insert commands for each value
  const res = await db.run(
    insertSql,
    user.username,
    user.profilePic,
    user.bio,
    user.shippingAddress,
    user.password
  );

  return new Response(JSON.stringify(res), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}
