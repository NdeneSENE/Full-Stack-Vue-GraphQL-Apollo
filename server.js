const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

//  Import typeDefs and resolvers
const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");
const resolvers = require("./resolvers");

// Import Environement variables and Mongoose models
require("dotenv").config({ path: "variables.env" });
const User = require("./model/User");
const Post = require("./model/Post");

// Connect to MongoDB DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.error(err));

// Verify JWT Token passed from client
const getUser = async (token) => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (err) {
      throw new AuthenticationError(
        "Votre session a expiré. SVP connectez-vous."
      );
    }
  }
};

// Create Apollo/GraphQL server using typeDefs, resolvers and context object
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    return {
      name: error.name,
      message: error.message.replace("Context creation failed:", ""),
    };
  },
  context: async ({ req }) => {
    const token = req.headers["authorization"];
    return { User, Post, currentUser: await getUser(token) };
  },
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
