import { type NextRequest } from "next/server";
import { Database, OPEN_CREATE, OPEN_READWRITE } from "sqlite3";
import { open } from "sqlite";
import { Rating, RatingSchema, User, UserSchema } from "@/db/schema";
// // Initialize a variable to hold the SQLite database connection
// let db = null as any;

// Handler for GET requests to retrieve all todos
export async function GET(
  request: NextRequest,
  { params }: { params: { ratingId: string } }
) {
  const ratingId = params.ratingId;

  const db = await open({
    filename: "./db/ratings.db",
    driver: require("sqlite3").Database,
  });

  await db.exec(RatingSchema);

  const rating = await db.get("SELECT * FROM ratings WHERE id = ?", ratingId);

  if (!rating) {
    return new Response(JSON.stringify({ error: "Rating not found" }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 404,
    });
  }

  return new Response(JSON.stringify(rating), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { ratingId: string } }
) {
  const body = await request.json();
  const rating = body as Omit<
    Rating,
    "timestamp" | "id" | "rating" | "author" | "target"
  >;

  const ratingId = params.ratingId;

  const db = await open({
    filename: "./db/ratings.db",
    driver: require("sqlite3").Database,
  });

  // SQL command for insertion
  const updateSql = `UPDATE ratings SET stars = ?, comment = ? WHERE id = ?`;

  // Execute insert commands for each value
  const res = await db.run(updateSql, rating.stars, rating.comment, ratingId);

  return new Response(JSON.stringify(res), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { ratingId: string } }
) {
  const ratingId = params.ratingId;

  const db = await open({
    filename: "./db/ratings.db",
    driver: require("sqlite3").Database,
  });

  // SQL command for insertion
  const deleteSql = `DELETE FROM ratings WHERE id = ?`;

  // Execute insert commands for each value
  const res = await db.run(deleteSql, ratingId);

  return new Response(JSON.stringify(res), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}
