export type Category = {
  display: string;
  value: string;
  description: string;
};

export const CATEGORIES: Category[] = [
  {
    display: "Collectibles & Art",
    value: "collectiblesAndArt",
    description: "NFTs, trading cards, and more",
  },
  {
    display: "Electronics",
    value: "electronics",
    description: "Computers, phones, and more",
  },
  {
    display: "Home & Garden",
    value: "homeAndGarden",
    description: "Furniture, kitchenware, and more",
  },
  {
    display: "Jewelry & Accessories",
    value: "jewelryAndAccessories",
    description: "Watches, rings, and more",
  },
  {
    display: "Toys & Games",
    value: "toysAndGames",
    description: "Board games, video games, and more",
  },
];

export const valueToCategory = (value: string): Category | null => {
  const category = CATEGORIES.find((category) => category.value === value);
  if (!category) {
    return null;
  }
  return category;
};
