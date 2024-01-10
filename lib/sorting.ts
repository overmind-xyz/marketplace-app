export type Sort = {
  display: string;
  value: string;
};

export const SORTS: Sort[] = [
  { display: "Newest", value: "newest" },
  { display: "Oldest", value: "oldest" },
  { display: "Price: Low to High", value: "priceAsc" },
  { display: "Price: High to Low", value: "priceDesc" },
];

export const valueToSort = (value: string): Sort | null => {
  const sort = SORTS.find((sort) => sort.value === value);
  if (!sort) {
    return null;
  }
  return sort;
};
