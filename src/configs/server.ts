import fs = require('fs')
import path = require('path')
import { ApolloServer } from "apollo-server-express";
// import typeDefs from "./schema/typeDev";
import resolvers from "../repository/resolvers";

const typeDefs = fs.readFileSync(path.join(__dirname, "./schema", "schema.graphql"), "utf8").toString()

const server = new ApolloServer ({
    typeDefs,
    resolvers
})

export default server
