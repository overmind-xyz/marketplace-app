import { type NextRequest } from "next/server";
import { Database, OPEN_CREATE, OPEN_READWRITE } from "sqlite3";
import { open } from "sqlite";
import { Purchase, PurchaseSchema, User, UserSchema } from "@/db/schema";
// // Initialize a variable to hold the SQLite database connection
// let db = null as any;

// Handler for GET requests to retrieve all todos
export async function GET(
  request: NextRequest,
  { params }: { params: { purchaseId: string } }
) {
  const purchaseId = params.purchaseId;

  const db = await open({
    filename: "./db/purchases.db",
    driver: require("sqlite3").Database,
  });

  await db.exec(PurchaseSchema);

  const purchase = await db.get(
    "SELECT * FROM purchases WHERE id = ?",
    purchaseId
  );

  if (!purchase) {
    return new Response(JSON.stringify({ error: "Purchase not found" }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 404,
    });
  }

  return new Response(JSON.stringify(purchase), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { purchaseId: string } }
) {
  const purchaseId = params.purchaseId;
  const body = await request.json();
  const status = body.status;

  if (!status) {
    return new Response(JSON.stringify({ error: "Status not provided" }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 400,
    });
  }

  const db = await open({
    filename: "./db/purchases.db",
    driver: require("sqlite3").Database,
  });

  // SQL command for insertion
  const updateSql = `UPDATE purchases SET status = ? WHERE id = ?`;

  // Execute insert commands for each value
  const res = await db.run(updateSql, status, purchaseId);

  return new Response(JSON.stringify(res), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { purchaseId: string } }
) {
  const purchaseId = params.purchaseId;

  const db = await open({
    filename: "./db/purchases.db",
    driver: require("sqlite3").Database,
  });

  // SQL command for insertion
  const deleteSql = `DELETE FROM purchases WHERE id = ?`;

  // Execute insert commands for each value
  const res = await db.run(deleteSql, purchaseId);

  return new Response(JSON.stringify(res), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}
