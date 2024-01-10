import { type NextRequest } from "next/server";
import { Database, OPEN_CREATE, OPEN_READWRITE } from "sqlite3";
import { open } from "sqlite";
import { Purchase, PurchaseSchema, User, UserSchema } from "@/db/schema";
// // Initialize a variable to hold the SQLite database connection
// let db = null as any;

// Handler for GET requests to retrieve all todos
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const buyerAddress = params.get("buyer");
  const sellerAddress = params.get("seller");

  const db = await open({
    filename: "./db/purchases.db",
    driver: require("sqlite3").Database,
  });

  await db.exec(PurchaseSchema);

  const baseQuery = `SELECT * FROM purchases`;
  const queryFilters = [
    buyerAddress
      ? {
          params: [buyerAddress],
          sql: "buyer = ?",
        }
      : null,
    sellerAddress
      ? {
          params: [sellerAddress],
          sql: "seller = ?",
        }
      : null,
  ].filter((filter) => filter !== null);

  const query =
    queryFilters.length > 0
      ? `${baseQuery} WHERE ${queryFilters
          .map((filter) => filter?.sql)
          .join(" AND ")}`
      : `${baseQuery}`;

  const purchases = await db.all(
    query,
    queryFilters.map((filter) => filter?.params).flat()
  );

  return new Response(JSON.stringify(purchases), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const purchase = body as Omit<Purchase, "timestamp">;

  const db = await open({
    filename: "./db/purchases.db",
    driver: require("sqlite3").Database,
  });

  await db.exec(PurchaseSchema);

  // SQL command for insertion
  const insertSql = `INSERT INTO purchases (itemId, buyer, seller, quantity, itemPrice, txnDigest) VALUES (?, ?, ?, ?, ?, ?)`;

  // Execute insert commands for each value
  const res = await db.run(
    insertSql,
    purchase.itemId,
    purchase.buyer,
    purchase.seller,
    purchase.quantity,
    purchase.itemPrice,
    purchase.txnDigest
  );

  return new Response(JSON.stringify(res), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}
