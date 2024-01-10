import { type NextRequest } from "next/server";
import { Database, OPEN_CREATE, OPEN_READWRITE } from "sqlite3";
import { open } from "sqlite";
import { Item, ItemSchema, User, UserSchema } from "@/db/schema";
// // Initialize a variable to hold the SQLite database connection
// let db = null as any;

// Handler for GET requests to retrieve all todos
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const db = await open({
    filename: "./db/items.db",
    driver: require("sqlite3").Database,
  });

  await db.exec(ItemSchema);

  const item = (await db.get("SELECT * FROM items WHERE id = ?", id)) as Item;

  if (!item) {
    return new Response(JSON.stringify({ error: "Item not found" }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 404,
    });
  }

  return new Response(JSON.stringify(item), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const item = body as Omit<Item, "timestamp" | "id" | "shopId" | "owner">;

  const id = params.id;

  const db = await open({
    filename: "./db/items.db",
    driver: require("sqlite3").Database,
  });

  // SQL command for insertion
  const updateSql = `UPDATE items SET title = ?, description = ?, price = ?, image = ?, totalSupply = ?, availableSupply = ?, listed = ? WHERE id = ?`;

  // Execute insert commands for each value
  const res = await db.run(
    updateSql,
    item.title,
    item.description,
    item.price,
    item.image,
    item.totalSupply,
    item.availableSupply,
    item.listed,
    id
  );

  return new Response(JSON.stringify(res), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const db = await open({
    filename: "./db/items.db",
    driver: require("sqlite3").Database,
  });

  // SQL command for insertion
  const deleteSql = `DELETE FROM items WHERE id = ?`;

  // Execute insert commands for each value
  const res = await db.run(deleteSql, id);

  return new Response(JSON.stringify(res), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}
