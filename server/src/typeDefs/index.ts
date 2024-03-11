// multi-role-auth-appwrite/server/src/typeDefs/index.ts

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Item" type defines the queryable fields for every salable item in our data source.
  type Item {
    name: String
    price: String
    description: String
    seller: String
  }

  type SellerListing {
    name: String
    price: String
    description: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. 
  # In this case, the "allItems" query returns an array of zero or more salable Items (defined above).
  # and the sellerListings query returns an array of zero or more of seller's listed items on their account. 
  type Query {
    allItems: [Item]
    sellerListings: [SellerListing]
  }
`;

export default typeDefs;
