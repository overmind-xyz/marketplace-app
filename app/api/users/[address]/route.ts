import { type NextRequest } from "next/server";
import { Database, OPEN_CREATE, OPEN_READWRITE } from "sqlite3";
import { open } from "sqlite";
import { User, UserSchema } from "@/db/schema";
// // Initialize a variable to hold the SQLite database connection
// let db = null as any;

// Handler for GET requests to retrieve all todos
export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  const userAddress = params.address;

  const db = await open({
    filename: "./db/users.db",
    driver: require("sqlite3").Database,
  });

  await db.exec(UserSchema);

  const user = (await db.get(
    "SELECT * FROM users WHERE username = ?",
    userAddress
  )) as User;

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 404,
    });
  }

  return new Response(JSON.stringify(user), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { address: string } }
) {
  const body = await request.json();
  const user = body as Omit<User, "timestamp" | "address">;

  const userAddress = params.address;

  const db = await open({
    filename: "./db/users.db",
    driver: require("sqlite3").Database,
  });

  // SQL command for insertion
  const updateSql = `UPDATE users SET username = ?, profilePic = ?, bio = ?, password = ? WHERE username = ?`;

  // Execute insert commands for each value
  const res = await db.run(
    updateSql,
    user.username,
    user.profilePic,
    user.bio,
    user.password,
    userAddress
  );

  return new Response(JSON.stringify(res), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  const userAddress = params.address;

  const db = await open({
    filename: "./db/users.db",
    driver: require("sqlite3").Database,
  });

  // SQL command for insertion
  const deleteSql = `DELETE FROM users WHERE username = ?`;

  // Execute insert commands for each value
  const res = await db.run(deleteSql, userAddress);

  return new Response(JSON.stringify(res), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}
