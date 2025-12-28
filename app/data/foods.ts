// data/foods.ts
import { faker } from "@faker-js/faker";

export interface Food {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
}

// Define some realistic categories
const categories = ["Pizza", "Burger", "Drink", "Dessert", "Salad"];

export const fakeFoods: Food[] = Array.from({ length: 30 }).map(() => {
  const category = faker.helpers.arrayElement(categories); // pick a random category
  const name = `${category} ${faker.commerce.productName()}`; // prepend category to make it clear
  return {
    id: faker.string.uuid(),
    name,
    description: faker.commerce.productDescription(),
    price: faker.commerce.price({ min: 5, max: 50, dec: 2 }),
    image: `https://picsum.photos/seed/${encodeURIComponent(name)}/400/300`,
    category,
  };
});
