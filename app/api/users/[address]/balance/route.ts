import { type NextRequest } from "next/server";
import { Database, OPEN_CREATE, OPEN_READWRITE } from "sqlite3";
import { open } from "sqlite";
import { User, UserSchema } from "@/db/schema";
// // Initialize a variable to hold the SQLite database connection
// let db = null as any;

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

  const shopBalance = (await db.get(
    "SELECT balance FROM users WHERE username = ?",
    userAddress
  )) as {
    balance: number;
  };

  if (!shopBalance) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 404,
    });
  }

  return new Response(JSON.stringify(shopBalance), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  const body = await request.json();
  const balance = body.balance as number | undefined;

  if (balance === undefined) {
    return new Response(JSON.stringify({ error: "Balance not found" }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 404,
    });
  }

  const userAddress = params.address;

  const db = await open({
    filename: "./db/users.db",
    driver: require("sqlite3").Database,
  });

  // SQL command for insertion
  const updateSql = `UPDATE users SET balance = ? WHERE username = ?`;

  // Execute insert commands for each value
  const res = await db.run(updateSql, balance, userAddress);

  return new Response(JSON.stringify(res), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}
