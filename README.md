# Marketplace App

This is the starter template for Overmind's Marketplace App quest. The quest can be viewed and submitted on the [Overmind site](https://overmind.xyz/quests/marketplace-app).

## Table of Contents

- [Marketplace App](#marketplace-app)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [App Navigation](#app-navigation)
  - [Developer Cheat Sheet](#developer-cheat-sheet)
    - [React and Next.js](#react-and-nextjs)
      - [Conditional rendering](#conditional-rendering)
      - [Rendering lists (mapping)](#rendering-lists-mapping)
    - [Next Auth](#next-auth)
      - [Sign in](#sign-in)
      - [Sign out](#sign-out)
      - [Sign up](#sign-up)
      - [Session](#session)
    - [URL read and write](#url-read-and-write)
      - [Reading dynamic routes](#reading-dynamic-routes)
      - [Writing dynamic routes](#writing-dynamic-routes)
      - [Reading query parameters](#reading-query-parameters)
      - [Writing query parameters](#writing-query-parameters)
    - [Window manipulation](#window-manipulation)
    - [Local storage](#local-storage)
    - [Database](#database)
  - [Quest](#quest)
    - [Deploying the app locally](#deploying-the-app-locally)
    - [Completing the quest](#completing-the-quest)

## Tech Stack

- [Yarn](https://yarnpkg.com/) package manager
- [React](https://react.dev/) library for building user interfaces
- [Next.js](https://nextjs.org/) framework for React
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for UI components using Radix UI and Tailwind CSS
- [SQLite](https://github.com/kriasoft/node-sqlite) database

## App Navigation

The marketplace app is a multi-page app. The pages are laid out as follows:

- `/` - The home page of the app. This page displays all of the listings that are available. The main page has the following query parameters:
  - `search` - The search query. This query parameter is used to filter the listings by title.
  - `category` - The category query. This query parameter is used to filter the listings by category.
- `/seller/[sellerId]` - The seller page of the app. This page displays all of the listings, reviews, and information for a specific seller. The seller's username is a [dynamic route](#reading-dynamic-routes) for the page. For example, `/seller/usernameHere`. The seller page has the following query parameters:
  - `tab` - The tab is a string that can be set the active tab of the page automatically. This can be used when navigating to a specific tab on the seller page.
  - `withdraw` - The withdraw query parameter is used to display the withdraw dialog when navigating to the seller page. This can be used when navigating to the seller page to withdraw funds.
- `/item/[username]/[itemId]` - The item page of the app. This page displays all of the information for a specific listing. The seller's username and the listing's id are passed dynamic routes for the page. For example, `/item/usernameHere/1`.
- `/cart` - The cart page of the app. This page displays all of the items that are in the user's cart.
- `/rate/[username]` - The rate page for a seller. This page allows the user to rate a seller. The seller's username is passed as a dynamic route for the page. For example, `/rate/usernameHere`.
- `/rate/[username]/[itemId]` - The rate page for an item. This page allows the user to rate an item. The seller's username and the listing's id are passed as dynamic routes for the page. For example, `/rate/usernameHere/1`.

## Developer Cheat Sheet

### React and Next.js

This app is built using React and Next.js. React is a JavaScript library for building user interfaces. Next.js is a React framework that provides a number of features including server-side rendering, file-based routing, and automatic code splitting.

#### Conditional rendering

This app uses conditional rendering to display different components and UIs (user interfaces) based on the state of the app. The following examples show how conditional rendering is used in this app.

The following code snippet shows how to render a component conditionally using the `&&`. For example:

```tsx
function App() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button onClick={() => setShow(!show)}>Toggle</button>
      {
        show && (
          <h1>Hello World</h1>
        )
      }
    </div>
  );
}
```

The above example will display a button and a heading. When the button is clicked, the heading will be toggled on and off.

The following code snippet shows how to render conditionally using the ternary operator. For example:

```tsx
function App() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button onClick={() => setShow(!show)}>Toggle</button>
      {
        show ? (
          <h1>Hello World</h1>
        ) : (
          <h1>Goodbye World</h1>
        )
      }
    </div>
  );
}
```

The above example will display a button and a heading. When the button is clicked, the heading will be toggled between `Hello World` and `Goodbye World`.

The following code snippet shows how to render conditionally using if statements and multiple returns. For example:

```tsx
function App() {
  const [show, setShow] = useState(false);

  if (show) {
    return (
      <div>
        <button onClick={() => setShow(!show)}>Toggle</button>
        <h1>Hello World</h1>
      </div>
    );
  } else {
    return (
      <div>
        <button onClick={() => setShow(!show)}>Toggle</button>
        <h1>Goodbye World</h1>
      </div>
    );
  }
}
```

The above example will display a button and a heading. When the button is clicked, the heading will be toggled between `Hello World` and `Goodbye World`.

#### Rendering lists (mapping)

There are times when a list of data needs to be rendered. If the list is static, the list can be hard-coded in the tsx file. If the list is dynamic, the list can be stored in a state variable and rendered using the `map` function.

This app uses the `map` function to render lists of data. The following examples show how the `map` function is used in this app.

The following code snippet shows how to render a list of items. The `map` function is used to render each item in the list. For example:

```tsx
function ItemList({
  items
} : {
  items: Item[]
}) {
  return (
    <div>
      {items.map((item) => (
        <ItemCard item={item} />
      ))}
    </div>
  );
}
```

### Next Auth

This app uses [Next Auth](https://next-auth.js.org/) for authentication. While Next Auth supports Google, Facebook, Twitter, and many other providers, this app uses a simple username and password authentication strategy as that is not the focus of this quest.

#### Sign in

To log in to an existing account, use the `signIn` function that is provided by Next Auth. For example:

```ts
signIn("credentials", { username: "usernameHere", password: "passwordHere" });
```

The above example will sign in the user with the username `usernameHere` and password `passwordHere`. If the user does not exist or the password is incorrect, an error will be thrown. If the user exists and the password is correct, the user will be signed in and the session will be updated.

#### Sign out

To sign out of an account, use the `signOut` function that is provided by Next Auth. For example:

```ts
await signOut()
```

The above example will sign out the user and clear the session.

#### Sign up

To sign up an account for the first time, you'll need to create the account in the database, then sign in the user using the `signIn` function.

#### Session

Once a user is signed in, the session, which contains information about the user and the status of their authentication, can be accessed using the `useSession` hook and the `getSession` function that are provided by Next Auth. For example:

```ts
const { data: session, status } = useSession();
```

The above example will return the session and the status of the session. The status can be `loading`, `authenticated`, or `unauthenticated`. The session is an object which contains the username of the user under the `name` key. For example: 

```ts
const { data: session, status } = useSession(); // get the session and status

/* 
  If the user is signed in, log their username to the console.
  Otherwise, do nothing.
*/
if (status === "authenticated") {
  console.log(session.name);
}
```

Note that the `useSession` hook can only be used in a React component that is a child of the `SessionProvider` component. In cases, where the `useSession` hook cannot be used, the `getSession` function can be used instead. For example:

```ts
const session = await getSession();

if (session != null) {
  console.log(session.name);
}
```

The above example will return the session if the user is signed in. Otherwise, it will return `null`.

### URL read and write

There are spots in the app that read query parameters and dynamic routes from the URL and other spots that write query parameters and dynamic routes to the URL. The following sections will explain how to read and write to the URL.

#### Reading dynamic routes

Dynamic routes are parts of the URL path that are dynamic. For example, the `/seller/[sellerId]` page has a dynamic route for the seller's username. The dynamic route is the `[sellerId]` part of the path. The dynamic route is accessed as a parameter of a component. For example:

```tsx
function SellerPage({
  params
} : {
  params: {
    sellerId: string
  }
}) {
  return (
    <div>
      <h1>{params.sellerId}</h1>
    </div>
  );
}
```

The above example will display the seller's username in a heading. For example, if the URL is `/seller/usernameHere`, the heading will display `usernameHere`.

#### Writing dynamic routes

Navigating to a dynamic route is as easy as filling in the URL path with the dynamic routes you want to use. For example, to navigate to the seller page of the user `JohnDoe`, you would create the link `/seller/JohnDoe`. The dynamic route will be filled in with the username `JohnDoe`.

#### Reading query parameters

Query parameters are parts of the URL that are not part of the path. Query parameters can be read using the `useSearchParams` hook. For example:

```tsx
function HomePage() {
  const searchParams = useSearchParams();

  const search = searchParams.get("search");

  return (
    <div>
      <h1>{search || 'No search param given'}</h1>
    </div>
  )
}
```

Query parameters can also be read using the `URLSearchParams` function. For example:

```tsx
function HomePage() {

  const [searchParams, setSearchParams] = useState("");
  
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const search = searchParams.get("search");

    if (search != null) {
      setSearchParams(search);
    }
  }, []);

  return (
    <div>
      <h1>{search}</h1>
    </div>
  )
}
```

The above example will display the search query parameter in a heading. For example, if the URL is `/?search=test`, the heading will display `test`. If the URL is `/`, the heading will display `No search param given`.

#### Writing query parameters

Query parameters are set by adding a `?` to the end of the URL path, followed by the query parameters. For example, to set the `search` query parameter to `test`, you would create the link `/?search=test`. The query parameter will be set to `test`.

To set multiple query parameters, you can use the `&` character to separate the query parameters. For example, to set the `search` query parameter to `test` and the `category` query parameter to `electronics`, you would create the link `/?search=test&category=electronics`. The `search` query parameter will be set to `test` and the `category` query parameter will be set to `electronics`.

### Window manipulation

The `window` object can be used to manipulate the URL, emit events, and edit the navigation history in the browser. Here are the following manipulation methods related to this app:

- reload window: `window.location.reload()`
- navigate to a new URL: `window.location.href = "new path"` (where `new path` is the new path to navigate to)
- remove parts of the URL without reloading the page: `window.history.replaceState(null, "", "new path")`
- fire an event: `window.dispatchEvent(new Event("cartUpdated"))`
- listen for an event: `window.addEventListener("cartUpdated", handleCartChange)` (where `handleCartChange` is a function that will be called when the event is fired)
- access url query parameters: `window.location.search` (returns the query parameters as a string), can be parsed using `new URLSearchParams(window.location.search)`

### Local storage

The `localStorage` object can be used to store data in the browser. The data will persist even if the user closes the browser. Here are the following methods related to this app:

- set an item: `localStorage.setItem("key", "value")` (where `key` is the key of the item and `value` is the value of the item to be stored as a string)
- get an item: `localStorage.getItem("key")` (where `key` is the key of the item) (returns `null` if the item does not exist)

### Database

The app uses a SQLite database to store the app data directly in the app's local file system. All of the database functionality and API endpoints have been implemented for you. The database functionality can be found in the [`db/utils.ts`](./db/utils.ts) file, while all of the types used can be found in [`db/schema.ts`](./db/schema.ts).

## Quest

### Deploying the app locally

1. Navigate to the [root directory](./) of the app.
2. Run `yarn install` to install the dependencies.
3. Run `yarn dev` to start the app.
4. Open [http://localhost:3000](http://localhost:3000) to view the app in the browser.

### Completing the quest

1. Read the README.md file (this file)
2. Visit and try out the demo app [here](https://marketplace.overmind.xyz/)
3. Deploy and open the app locally as described [above](#deploying-the-app-locally)
4. Complete the app by following the comments marked with `TODO` in the following files (recommended order):
   - [ ] [main page](./app/page.tsx) - After completing this file, you should be able to see the main page show a loading indicator, then display the listings (which are none at the moment).
   - [ ] [profileButton.tsx](./components/profileButton.tsx) - After completing this file, you should be able to see the connect button in the top right corner of the app. Sign up a new account and you should see the button display your username. Clicking the button will open a menu with options such as disconnect. Clicking disconnect will sign you out.
   - [ ] [createListingModal.tsx](./components/createListingModal.tsx) - After completing this file, you should see a sell button next to your displayed username. Clicking the sell button will open a modal that allows you to create a new listing. After creating a listing, you should be redirected to your seller page, which will just show 'PLACEHOLDER' for now. Navigate back to the main page and you should see the 'no listings' message disappear. Your listing should be displayed when you create the next file.
   - [ ] [itemCard.tsx](./components/itemCard.tsx) - After completing this file, you should see the listings you create on the main page. Clicking on a listing will navigate you to the item page, which will show the partial item information and a placeholder for reviews.
   - [ ] [purchaseSection.tsx](./app/item/[username]/[itemId]/purchaseSection.tsx) - After completing this file, you should see a list of actions to the right of the item information on the item page. Depending on who is viewing the page, this will show different actions. If the user is the seller, the actions will be to remove the listing. If the user is logged in and not the seller, the actions will be to add the item to the cart, buy the item, and add the item to the watch list. If the user is not logged in, the actions will be to sign in or sign up.
   - [ ] [seller page](./app/seller/[sellerId]/page.tsx) - After completing this file, you should see part of the seller page being displayed.
   - [ ] [listingChart.tsx](./app/seller/[sellerId]/listingChart.tsx) - After completing this file, you should see the listings on the seller page being displayed. Clicking on a listing will navigate you to the item page.
   - [ ] [editProfileModal.tsx](./components/editProfileModal.tsx) - After completing this file, you should be able to edit your profile by clicking on the edit profile button on the seller page.
   - [ ] [sellerStats.tsx](./app/seller/[sellerId]/sellerStats.tsx) - After completing this file, you should see the seller stats on the seller page. The stats should update whenever a purchase is made and later when reviews are added.
   - [ ] [withdrawModal.tsx](./components/withdrawModal.tsx) - After completing this file, you should be able to withdraw any funds you have earned by clicking on the withdraw button on the seller page.
   - [ ] [cart page](./app/cart/page.tsx) - After completing this file, you should be able to add items to your cart and view them on the cart page. Clicking on the cart button in the top right corner of the app will open the cart page.
   - [ ] [reviewListForAuthor.tsx](./components/reviewListForAuthor.tsx) - After completing this file, you should be able to see the reviews you have written under the 'your reviews' tab on the seller page. The reviews cards will be incomplete until you complete `reviewCard.tsx` To write a review, purchase an item, view the item on the purchases table, and select `rate item` or `rate seller`.
   - [ ] [reviewListForTarget.tsx](./components/reviewListForTarget.tsx) - After completing this file, you should be able to see the reviews that have been written about a seller or item on the seller page or item page. The reviews cards will be incomplete until you complete `reviewCard.tsx`.
   - [ ] [reviewCard.tsx](./components/reviewCard.tsx) - After completing this file, you should see complete review cards.
