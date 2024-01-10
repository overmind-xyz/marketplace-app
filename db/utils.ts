import { Item, Purchase, Rating, User, WatchList } from "./schema";

export type ItemQueryFilters = {
  user?: string;
  listed?: number;
  search?: string;
  category?: string;
  sort?: string;
};

/* 
  Checks if a user with the given username exists in the database. 
  Returns true if the user exists, false otherwise.
*/
export async function doesUserExist(username: string) {
  const userFromDb = await fetch(
    `http://localhost:3000/api/users/${username}`
  );
  const userFromDbJson = await userFromDb.json();

  return !(userFromDbJson.error === "User not found");
}

/*
  Creates a new user with the given username and password.
*/
export async function createUser(username: string, password: string) {
  const userCreation = await fetch(
    `http://localhost:3000/api/users`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        bio: "",
        profilePic: "",
        shippingAddress: "",
        password,
      } as User),
    }
  );
  const userCreationJson = await userCreation.json();
  return userCreationJson;
}

/* 
  Retrieves the user with the given username from the database.
*/
export async function getUser(username: string) {
  const userFromDb = await fetch(
    `http://localhost:3000/api/users/${username}`,
    {
      method: "GET",
      cache: "no-cache",
      headers: { "Content-Type": "application/json" },
    }
  );
  const userFromDbJson = await userFromDb.json();
  return userFromDbJson as User;
}

/* 
  Updates the user with the given username in the database. 
*/
export async function updateUser(user: Omit<User, "timestamp" | "balance">) {
  const userCreation = await fetch(
    `http://localhost:3000/api/users/${user.username}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    }
  );
  const userCreationJson = await userCreation.json();
  return userCreationJson;
}

/* 
  Creates a new item with the given item details.
*/
export async function addNewItem(
  item: Omit<Item, "timestamp" | "listed" | "availableSupply">
) {
  console.log("addNewItem", item);
  try {
    const itemCreation = await fetch(
      `http://localhost:3000/api/items`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...item,
          availableSupply: item.totalSupply,
        }),
      }
    );
    const itemCreationJson = await itemCreation.json();
    return itemCreationJson;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/* 
  Gets all items from the database that match the given query parameters.
*/
export async function getItems(queryParams?: ItemQueryFilters) {
  const baseUrl = `http://localhost:3000/api/items`;
  const userQuery = queryParams?.user ? `user=${queryParams.user}` : "";
  const listedQuery = queryParams?.listed ? `listed=${queryParams.listed}` : "";
  const searchQuery = queryParams?.search ? `search=${queryParams.search}` : "";
  const categoryQuery = queryParams?.category
    ? `category=${queryParams.category}`
    : "";
  const sortQuery = queryParams?.sort ? `sort=${queryParams.sort}` : "";

  const query = [userQuery, listedQuery, searchQuery, categoryQuery, sortQuery]
    .filter((query) => query !== "")
    .join("&");

  try {
    const items = await fetch(`${baseUrl}?${query}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
    });
    const itemsJson = await items.json();
    console.log("getItems", itemsJson);
    return itemsJson;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/* 
  Gets a specific item from the database with the given itemId.
  Returns null if the item does not exist.
*/
export async function getItemById(itemId: string): Promise<Item | null> {
  try {
    const item = await fetch(
      `http://localhost:3000/api/items/${itemId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      }
    );
    const itemJson = await item.json();
    console.log("getItemById", itemJson);
    return itemJson;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/* 
  Gets the number of purchases for a specific user with the given username.
*/
export async function getUserNumberOfPurchases(username: string) {
  try {
    const purchases = await fetch(
      `http://localhost:3000/api/purchases/count?buyer=${username}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      }
    );
    const purchasesJson = (await purchases.json()) as Purchase[];
    console.log("getUserNumberOfPurchases", purchasesJson);
    return purchasesJson.length;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

/* 
  Gets the number of sales for a specific user with the given username.
*/
export async function getUserNumberOfSales(username: string) {
  try {
    const purchases = await fetch(
      `http://localhost:3000/api/purchases/count?seller=${username}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      }
    );
    const purchasesJson = (await purchases.json()) as Purchase[];
    console.log("getUserNumberOfSales", purchasesJson);
    return purchasesJson.length;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

/*
  Purchase an item with the given itemId and quantity, for the given buyer.
  Returns the purchaseId if the purchase was successful, null otherwise.
*/
export async function purchaseItem(
  itemId: string,
  quantity: number,
  buyer: string
) {
  const item = await getItemById(itemId);

  if (!item) {
    return null;
  }

  if (item.availableSupply < quantity) {
    return null;
  }

  const itemSeller = item.owner;

  let purchaseId = null;
  try {
    const updateBalanceRes = await updateUserShopBalance(
      itemSeller,
      item.price * quantity
    );

    if (updateBalanceRes.status !== "success") {
      return null;
    }

    const purchase = await fetch(
      `http://localhost:3000/api/purchases`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          buyer,
          seller: itemSeller,
          quantity,
          itemPrice: item.price,
          txnDigest: "",
        }),
      }
    );
    const purchaseJson = await purchase.json();
    console.log("purchaseItem", purchaseJson);
    purchaseId = purchaseJson.lastID;
  } catch (error) {
    console.error(error);
    return null;
  }

  try {
    const updateItem = await fetch(
      `http://localhost:3000/api/items/${itemId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...item,
          availableSupply: item.availableSupply - quantity,
          listed: item.availableSupply - quantity > 0 ? 1 : 0,
        }),
      }
    );
    const updateItemJson = await updateItem.json();
    console.log("updateItem", updateItemJson);
    return purchaseId;
  } catch (error) {
    const deletePurchase = await fetch(
      `http://localhost:3000/api/purchases/${purchaseId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    const deletePurchaseJson = await deletePurchase.json();
    console.log("deletePurchase", deletePurchaseJson);
    return null;
  }
}

/* 
  Gets all purchases from a specific buyer with the given username.
*/
export async function getUserPurchases(username: string) {
  try {
    const purchases = await fetch(
      `http://localhost:3000/api/purchases?buyer=${username}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      }
    );
    const purchasesJson = (await purchases.json()) as Purchase[];
    console.log("getUserPurchases", purchasesJson);
    return purchasesJson;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* 
  Gets all sales from a specific seller with the given username.
*/
export async function getUserSales(username: string) {
  try {
    const purchases = await fetch(
      `http://localhost:3000/api/purchases?seller=${username}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      }
    );
    const purchasesJson = (await purchases.json()) as Purchase[];
    console.log("getUserSales", purchasesJson);
    return purchasesJson;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* 
  Increase the balance of the users shop with the given username by the given amount.
*/
export async function updateUserShopBalance(
  username: string,
  balanceToAdd: number
) {
  try {
    const user = await getUser(username);
    const updateBalance = await fetch(
      `http://localhost:3000/api/users/${username}/balance`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          balance: user.balance + balanceToAdd,
        }),
      }
    );
    const updateBalanceJson = await updateBalance.json();
    if (updateBalanceJson.changes == 1) {
      return {
        status: "success",
        balance: user.balance + balanceToAdd,
      };
    } else {
      return {
        status: "failure",
        balance: user.balance,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      error: error,
    };
  }
}

/* 
  Unlists an item with the given itemId. 
*/
export async function unlistItem(itemId: string) {
  const item = await getItemById(itemId);

  if (!item) {
    return null;
  }

  try {
    item.listed = 0;
    const updateItem = await fetch(
      `http://localhost:3000/api/items/${itemId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      }
    );
    const res = await updateItem.json();
    console.log("updateItem", res);
    return res;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/* 
  Gets the balance of a user's shop with the given username.
*/
export async function getUserShopBalance(
  username: string
): Promise<number | null> {
  try {
    const balance = await fetch(
      `http://localhost:3000/api/users/${username}/balance`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      }
    );
    const balanceJson = await balance.json();
    console.log("getUserShopBalance", balanceJson);
    return balanceJson.balance;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/* 
  Submits a review for an item or user with the given targetId. 
*/
export async function submitReview(review: Omit<Rating, "id" | "timestamp">) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/ratings`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      }
    );
    const resJson = await res.json();
    console.log("submitItemReview", resJson);
    return resJson;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/* 
  Updates an existing review with the given reviewId.
*/
export async function updateReview(
  reviewId: number,
  review: Omit<Rating, "id" | "timestamp" | "author" | "target">
) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/ratings/${reviewId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      }
    );
    const resJson = await res.json();
    console.log("updateReview", resJson);
    return resJson;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/* 
  Gets the review for the given targetId and by the given author.
*/
export async function getReviewByTargetAndAuthor(
  target: string,
  author: string
) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/ratings?target=${target}&author=${author}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      }
    );
    const resJson = await res.json();
    console.log("getReviewByTargetAndAuthor", resJson);
    return resJson[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

/* 
  Subtract the given amount from the balance of the users shop with the given username.
*/
export async function withdrawBalanceFromShop(
  userAddress: string,
  amount: number
) {
  try {
    const user = await getUser(userAddress);
    const updateBalance = await fetch(
      `http://localhost:3000/api/users/${userAddress}/balance`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          balance: user.balance - amount,
        }),
      }
    );
    const updateBalanceJson = await updateBalance.json();
    if (updateBalanceJson.changes == 1) {
      return {
        status: "success",
        balance: user.balance - amount,
      };
    } else {
      return {
        status: "failure",
        balance: user.balance,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      error: error,
    };
  }
}

/* 
  Updates the status of a purchase with the given purchaseId.
*/
export async function updatePurchaseStatus(purchaseId: number, status: string) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/purchases/${purchaseId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: status,
        }),
      }
    );
    const resJson = await res.json();
    console.log("updatePurchaseStatus", resJson);
    return resJson;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/*
  Gets the average rating for the given targetId.
*/
export async function getStarsForTarget(targetId: string) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/ratings/stars?target=${targetId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      }
    );
    const resJson = await res.json();
    console.log("getRatingForItem", resJson);
    return resJson as number;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/* 
  Gets all reviews for the given targetId.
*/
export async function getReviewsForTarget(targetId: string) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/ratings?target=${targetId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      }
    );
    const resJson = await res.json();
    console.log("getRatingForItem", resJson);
    return resJson as Rating[];
  } catch (error) {
    console.error(error);
    return null;
  }
}

/* 
  Gets all reviews created by the given author.
*/
export async function getReviewsFromAuthor(authorId: string) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/ratings?author=${authorId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      }
    );
    const resJson = await res.json();
    console.log("getRatingForItem", resJson);
    return resJson as Rating[];
  } catch (error) {
    console.error(error);
    return null;
  }
}

/*
  Gets the number of ratings for the given targetId.
*/
export async function getNumberOfRatingsForTarget(targetId: string) {
  const reviews = await getReviewsForTarget(targetId);
  return reviews?.length || 0;
}

/* 
  Gets the items in a user's watch list with the given username.
*/
export async function getUserWatchListItems(userAddress: string) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/watchlist?user=${userAddress}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      }
    );
    const resJson = await res.json();
    console.log("getUserWatchListItems", resJson);
    return resJson as WatchList[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* 
  Adds an item to the user's watch list.
*/
export async function addItemToWatchList(userAddress: string, itemId: string) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/watchlist`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userAddress,
          itemId: itemId,
        }),
      }
    );
    const resJson = await res.json();
    console.log("addItemToWatchList", resJson);
    return resJson;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/* 
  Removes an item from the user's watch list.
*/
export async function removeItemFromWatchList(
  userAddress: string,
  itemId: string
) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/watchlist?user=${userAddress}&itemId=${itemId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    const resJson = await res.json();
    console.log("removeItemFromWatchList", resJson);
    return resJson;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/* 
  Checks if the given item is in the user's watch list.
*/
export async function isUserWatchingItem(username: string, itemId: string) {
  console.log("isUserWatchingItem", username, itemId);

  try {
    const res = await fetch(
      `http://localhost:3000/api/watchlist?user=${username}&itemId=${itemId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      }
    );
    const resJson = await res.json();
    console.log("isUserWatchingItem", resJson);
    return resJson.length > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
}
