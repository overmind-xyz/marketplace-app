import { WatchList, WatchlistSchema } from "@/db/schema";
import { NextRequest } from "next/server";
import { open } from "sqlite";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const userAddress = params.get("user");
  const itemId = params.get("itemId");

  const db = await open({
    filename: "./db/watchlist.db",
    driver: require("sqlite3").Database,
  });

  await db.exec(WatchlistSchema);

  const baseQuery = "SELECT * FROM watchlist";
  const queryFilters = [
    userAddress
      ? {
          params: [userAddress],
          sql: "userId = ?",
        }
      : null,
    itemId
      ? {
          params: [itemId],
          sql: "itemId = ?",
        }
      : null,
  ].filter((filter) => filter !== null);

  const query =
    queryFilters.length > 0
      ? `${baseQuery} WHERE ${queryFilters
          .map((filter) => filter?.sql)
          .join(" AND ")}`
      : `${baseQuery}`;

  const watchLists = (await db.all(
    query,
    queryFilters.map((filter) => filter?.params).flat()
  )) as WatchList[];

  return new Response(JSON.stringify(watchLists), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = body as WatchList;

  const db = await open({
    filename: "./db/watchlist.db",
    driver: require("sqlite3").Database,
  });

  await db.exec(WatchlistSchema);

  const insertSql = `INSERT INTO watchlist (userId, itemId) VALUES (?, ?)`;

  const res = await db.run(insertSql, user.userId, user.itemId);

  return new Response(JSON.stringify(res), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

export async function DELETE(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const userAddress = params.get("user");
  const itemId = params.get("itemId");

  const db = await open({
    filename: "./db/watchlist.db",
    driver: require("sqlite3").Database,
  });

  await db.exec(WatchlistSchema);

  const deleteSql = `DELETE FROM watchlist WHERE userId = ? AND itemId = ?`;

  const res = await db.run(deleteSql, userAddress, itemId);

  return new Response(JSON.stringify(res), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}
