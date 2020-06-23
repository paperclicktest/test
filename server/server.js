"user strict";

const mongoose = require("mongoose");
require("dotenv").config();
const dbconfig = require("./dbconfig");
const Hapi = require("hapi");
const port = process.env.PORT || 9000;
const server = Hapi.server({
  port: port,
  host: "0.0.0.0",
});

const init = async () => {
  await server.register(
    { plugin: require("./routes/accounts") },
    {
      routes: {
        prefix: "/api",
      },
    },
    (err) => {
      if (err) {
        throw err;
      }
    }
  );
  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hello World!";
    },
  });
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
