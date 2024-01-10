import { type NextRequest } from "next/server";
import { Database, OPEN_CREATE, OPEN_READWRITE } from "sqlite3";
import { open } from "sqlite";
import { Purchase, PurchaseSchema, User, UserSchema } from "@/db/schema";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const buyer = params.get("buyer");
  const seller = params.get("seller");

  const db = await open({
    filename: "./db/purchases.db",
    driver: require("sqlite3").Database,
  });

  await db.exec(PurchaseSchema);

  if (buyer) {
    const purchases = (await db.all(
      "SELECT * FROM purchases WHERE buyer = ?",
      buyer
    )) as Purchase[];

    return new Response(JSON.stringify(purchases), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  } else if (seller) {
    const purchases = (await db.all(
      "SELECT * FROM purchases WHERE seller = ?",
      seller
    )) as Purchase[];

    return new Response(JSON.stringify(purchases), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  } else {
    const purchases = (await db.all("SELECT * FROM purchases")) as Purchase[];
    return new Response(JSON.stringify(purchases), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  }
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
  const insertSql = `INSERT INTO purchases (itemId, buyer, seller, quantity, itemPrice) VALUES (?, ?, ?, ?, ?)`;

  // Execute insert commands for each value
  const res = await db.run(
    insertSql,
    purchase.itemId,
    purchase.buyer,
    purchase.seller,
    purchase.quantity,
    purchase.itemPrice
  );

  return new Response(JSON.stringify(res), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}
