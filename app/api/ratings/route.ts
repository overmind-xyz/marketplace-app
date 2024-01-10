import { type NextRequest } from "next/server";
import { Database, OPEN_CREATE, OPEN_READWRITE } from "sqlite3";
import { open } from "sqlite";
import { Rating, RatingSchema, User, UserSchema } from "@/db/schema";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const authorAddress = params.get("author");
  const targetAddress = params.get("target");

  const db = await open({
    filename: "./db/ratings.db",
    driver: require("sqlite3").Database,
  });

  await db.exec(RatingSchema);

  const baseQuery = "SELECT * FROM ratings";
  const queryFilters = [
    authorAddress
      ? {
          params: [authorAddress],
          sql: "author = ?",
        }
      : null,
    targetAddress
      ? {
          params: [targetAddress],
          sql: "target = ?",
        }
      : null,
  ].filter((filter) => filter !== null);

  const query =
    queryFilters.length > 0
      ? `${baseQuery} WHERE ${queryFilters
          .map((filter) => filter?.sql)
          .join(" AND ")}`
      : `${baseQuery}`;

  const ratings = await db.all(
    query,
    queryFilters.map((filter) => filter?.params).flat()
  );

  return new Response(JSON.stringify(ratings), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const rating = body as Omit<Rating, "timestamp">;

  const db = await open({
    filename: "./db/ratings.db",
    driver: require("sqlite3").Database,
  });

  await db.exec(RatingSchema);

  // SQL command for insertion
  const insertSql = `INSERT INTO ratings (target, author, stars, comment) VALUES (?, ?, ?, ?)`;

  // Execute insert commands for each value
  const res = await db.run(
    insertSql,
    rating.target,
    rating.author,
    rating.stars,
    rating.comment
  );

  return new Response(JSON.stringify(res), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}
