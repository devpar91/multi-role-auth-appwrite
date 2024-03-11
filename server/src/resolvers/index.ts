// multi-role-auth-appwrite/server/src/resolvers/index.ts

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves items from the "items" array above.
const resolvers = {
  Query: {
    allItems: () => allItems,
    sellerListings: () => sellerListings,
  },
};

const allItems = [
  {
    name: "item 1",
    price: "$100",
    descritption: "description of item 1",
    seller: "Kate Chopin",
  },
  {
    name: "item 2",
    price: "$200",
    descritption: "description of item 2",
    seller: "Paul Auster",
  },
];

const sellerListings = [
  {
    name: "item 1",
    price: "$100",
    descritption: "description of item 1",
  },
  {
    name: "item 2",
    price: "$200",
    descritption: "description of item 2",
  },
];

export default resolvers;
