"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { Button } from "./ui/button";
import { useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { CATEGORIES, Category, valueToCategory } from "@/lib/categories";

/* 
  This component is responsible for rendering the search bar. It is displayed in the header.
*/
export default function SearchBar() {
  
  const [category, setCategory] = useState<Category | null>(null); // The category of the search
  const [search, setSearch] = useState<string>(""); // The search query
  
  const urlParams = useSearchParams(); // The URL parameters
  const categoryParam = urlParams.get("category"); // The category parameter
  const searchParam = urlParams.get("search"); // The search parameter

  /* 
    On page load, get the category and search query from the URL parameters.
  */
  useEffect(() => {
    /* 
      If the category parameter exists, set the category state to the category parameter. If 
      the search parameter exists, set the search state to the search parameter.
    */
    if (categoryParam) {
      setCategory(valueToCategory(categoryParam));
    }

    if (searchParam) {
      setSearch(searchParam);
    }
    
  }, []);

  return (
    <div className="flex flex-row items-center gap-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Shop by category</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {CATEGORIES.map((category) => (
                  <ListItem
                    key={category.display}
                    title={category.display}
                    href={`/?category=${category.value}`}
                  >
                    {category.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex flex-row gap-2 items-center">
        <div className="flex flex-row ">
          <Input
            className="w-[300px] focus-visible:ring-0 rounded-none rounded-l-lg"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <Select
            value={category?.value}
            onValueChange={(value) => {
              if (value === category?.value) {
                setCategory(null);
              } else {
                setCategory(valueToCategory(value));
              }
            }}
          >
            <SelectTrigger className="w-[180px] rounded-none rounded-r-lg focus-visible:ring-0 focus:ring-0">
              <SelectValue placeholder="Search in category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.display}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          disabled={search === ""}
          onClick={() => {
            window.location.href = `/?category=${category?.value}&search=${search}`;
          }}
          className="bg-[#FFDFD7] text-black hover:bg-[#FFE9E3]"
        >
          Search
        </Button>
      </div>
    </div>
  );
}

const ListItem = forwardRef<ElementRef<"a">, ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
