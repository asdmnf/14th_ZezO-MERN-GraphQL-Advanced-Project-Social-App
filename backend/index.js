const path = require("path");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const dbConnection = require("./config/dbConnection");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require('@apollo/server/express4');
const getUserByToken = require("./utils/getUserByToken");
const schemaWithPermissions = require("./graphql/schema");
const { graphqlUploadExpress } = require('graphql-upload');

// mongoDB connection
dbConnection();

// express app
const app = express();

// apply cors middlewares
app.use(cors());

//  parse incoming requests with JSON payloads
app.use(express.json());

// parse incoming requests with urlencoded payload
app.use(express.urlencoded({ extended: true }));

// apply express middleware for serving static files
app.use(express.static(path.join(__dirname, "uploads")));

// apply morgan middleware in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// graphQl server
const gqlServer = async () => {
  const server = new ApolloServer({
    schema: schemaWithPermissions,
    formatError: (error) => {
      console.log(`${error.path}`.bgRed, `${error.message}`.red, error.extensions.stacktrace)
      return {
        message: error.message,
        code: error.extensions.code,
        path: error.path,
        stack: process.env.NODE_ENV === "development" ? error.extensions : undefined,
        err: error
      }
    }
  })

  app.use(graphqlUploadExpress({
    maxFileSize: parseInt(process.env.GRAPHQL_UPLOAD_MAX_FILE_SIZE),
  }))
  await server.start();
  app.use('/graphql', expressMiddleware(server,
    {
      context: async ({ req }) => {
          const user = await getUserByToken(req)
          return { user, req }
      },
    },
    ));
}

gqlServer();

app.get("/", (req, res) => {
  res.send("Hello ZezO")
})

// server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App listening on port: ${port}`.yellow.underline.bold)
  console.log(`Mode: ${process.env.NODE_ENV ? process.env.NODE_ENV : "Not Specified"}`.magenta.underline.bold)
})

// unhandled rejection error
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Error --> ${err.name} : ${err.message}`.bgRed.underline.bold)
  server.close(() => { 
      console.error("Shutting down App ...".red.underline.bold)
      process.exit(1)
  })
})