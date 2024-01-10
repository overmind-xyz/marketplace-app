import { type NextRequest } from "next/server";
import { Database, OPEN_CREATE, OPEN_READWRITE } from "sqlite3";
import { open } from "sqlite";
import { Item, ItemSchema, User, UserSchema } from "@/db/schema";

type GetUserParam = string | null;
type GetListedParam = number | null;
type GetSearchParam = string | null;
type GetSortParam = string | null;
type GetCategoryParam = string | null;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const userAddress = params.get("user");
  const listed = params.get("listed");
  const search = params.get("search");
  const category = params.get("category");
  const sort = params.get("sort");

  const db = await open({
    filename: "./db/items.db",
    driver: require("sqlite3").Database,
  });

  await db.exec(ItemSchema);

  const baseQuery = "SELECT * FROM items";
  const queryFilters = [
    userAddress
      ? {
          params: [userAddress],
          sql: "owner = ?",
        }
      : null,
    listed
      ? {
          params: [listed],
          sql: "listed = ?",
        }
      : null,
    search
      ? {
          params: [`%${search}%`, `%${search}%`],
          sql: "(title LIKE ? OR description LIKE ?)",
        }
      : null,
    category
      ? {
          params: [category],
          sql: "category = ?",
        }
      : null,
  ].filter((filter) => filter !== null);
  const sortFilter = sort
    ? {
        params: [],
        sql:
          sort === "priceAsc"
            ? "ORDER BY price ASC"
            : sort === "priceDesc"
            ? "ORDER BY price DESC"
            : sort === "newest"
            ? "ORDER BY timestamp DESC"
            : sort === "oldest"
            ? "ORDER BY timestamp ASC"
            : "",
        // sort === 'RatingHiLo' ? 'ORDER BY rating DESC' : ''
        // sort === 'UserRatingHiLo' ? 'ORDER BY userRating DESC' : '',
      }
    : null;

  const query =
    queryFilters.length > 0
      ? `${baseQuery} WHERE ${queryFilters
          .map((filter) => filter?.sql)
          .join(" AND ")} ${sortFilter ? sortFilter.sql : ""}`
      : `${baseQuery} ${sortFilter ? sortFilter.sql : ""}`;

  console.log("query", query);

  const items = await db.all(
    query,
    queryFilters.map((filter) => filter?.params).flat()
  );

  return new Response(JSON.stringify(items), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const item = body as Omit<Item, "timestamp">;

  const db = await open({
    filename: "./db/items.db",
    driver: require("sqlite3").Database,
  });

  await db.exec(ItemSchema);

  // SQL command for insertion
  const insertSql = `INSERT INTO items (id, title, description, price, image, owner, totalSupply, availableSupply, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // Execute insert commands for each value
  const res = await db.run(
    insertSql,
    item.id,
    item.title,
    item.description,
    item.price,
    item.image,
    item.owner,
    item.totalSupply,
    item.availableSupply,
    item.category
  );

  return new Response(JSON.stringify(res), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}
