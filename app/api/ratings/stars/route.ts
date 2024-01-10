import { type NextRequest } from "next/server";
import { Database, OPEN_CREATE, OPEN_READWRITE } from "sqlite3";
import { open } from "sqlite";
import { Rating, RatingSchema, User, UserSchema } from "@/db/schema";

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get("target");

  if (!target) {
    return new Response(JSON.stringify({ error: "Target not found" }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 404,
    });
  }

  const db = await open({
    filename: "./db/ratings.db",
    driver: require("sqlite3").Database,
  });

  await db.exec(RatingSchema);

  const ratings = (await db.all(
    "SELECT * FROM ratings WHERE target = ?",
    target
  )) as Rating[];

  console.log("ratings", ratings);

  if (!ratings) {
    return new Response(JSON.stringify({ error: "Rating not found" }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 404,
    });
  }

  const stars =
    ratings.map((rating) => rating.stars).reduce((a, b) => a + b, 0) /
    ratings.length;

  return new Response(JSON.stringify(stars), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}
