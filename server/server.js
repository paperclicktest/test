"user strict";
require("dotenv").config();
const mongoose = require("mongoose");
const btoa = require("btoa");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const dbconfig = require("./dbconfig");
const Hapi = require("hapi");
const cors = require("cors");
const fetch = require("node-fetch");
const Account = require("./models/Account");
const port = process.env.PORT || 9000;
const key_jwt = process.env.SECRET_KEY;
const expiresIn = "30min";

const server = Hapi.server({
  port: port,
  host: "0.0.0.0",
});
// Create a token from a payload
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn,
  });
}

const init = async () => {
  //Checks if the user is correctly authenticated with jwt and returns the token
  server.route({
    config: {
      cors: {
        origin: ["*"],
        additionalHeaders: ["cache-control", "x-requested-with"],
      },
    },
    method: "POST",
    path: "/auth",
    handler: (req, rep) => {
      let username;
      if (req.params.username) {
        username = req.params.username;
      } else {
        if (req.query.username) {
          username = req.query.username;
        }
      }
      const user = {
        name: username,
      };
      const accessToken = jwt.sign(user, key_jwt);
      return accessToken;
    },
  });
  server.route({
    config: {
      cors: {
        origin: ["*"],
        additionalHeaders: ["cache-control", "x-requested-with"],
      },
    },
    method: "GET",
    path: "/",
    handler: (req, rep) => {
      return "SERVER OK";
    },
  });
  //Gets the repos for the specific user with authentication
  server.route({
    method: "POST",
    path: "/getRepos",
    config: {
      cors: {
        origin: ["*"],
        additionalHeaders: ["cache-control", "x-requested-with"],
      },

      handler: async (request, h) => {
        try {
          const authHeader = request.headers["authorization"];
          const token = authHeader && authHeader.split(" ")[1];

          const promise = new Promise((resolve, reject) => {
            jwt.verify(token, key_jwt, async (err, user) => {
              if (err) {
                const response = {
                  status: 403,
                  message: "Not Authorized",
                };
                resolve(response);
              } else {
                const { username, password } = request.payload;
                //  const response = h.response(user).code(200);

                const headers = {
                  Authorization: `Basic ${btoa(`${username}:${password}`)}`,
                  "Content-Type": "application/vnd.github.v3+json",
                };
                let repos = {};
                const url =
                  "https://api.github.com/users/" + username + "/repos";

                repos = await fetch(url, {
                  method: "GET",
                  headers: headers,
                });

                await repos.json().then((data) => {
                  resolve(data);
                });
              }
            });
          });
          return promise;
        } catch (err) {
          return h.response(err).code(403);
        }
      },
    },
  });
  //Route to check if username/password are correct. If yes, checks if user is currently inserted in db. If no, insert him
  server.route({
    config: {
      cors: {
        origin: ["*"],
        additionalHeaders: ["cache-control", "x-requested-with"],
      },
    },
    method: "POST",
    path: "/login",
    handler: async (req, h) => {
      // await Account.find({ username: "elanthi" }).remove();
      const { username, password } = req.payload;

      let found = await Account.findOne({
        username: username,
      });

      if (found == null) {
        try {
          let profile;
          const headers = {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
            "Content-Type": "application/vnd.github.v3+json",
          };
          const url = "https://api.github.com/users/" + username;

          profile = await fetch(url, {
            method: "GET",
            headers: headers,
          });

          let record = {};
          await profile.json().then((data) => {
            if (data.message) {
              record = data;
            } else {
              record = {
                username: username,
                password: password,
                email: data.email ? data.email : "",
                total_private_repos: data.total_private_repos,
                location: data.location ? data.location : "",
                blog: data.blog ? data.blog : "",
                bio: data.bio ? data.bio : "",
                commpany: data.company ? data.company : "",
              };
            }
          });
          if (record.username) {
            Account.create(record, function (err, rec) {
              if (err) {
                profile = {
                  error: err,
                };
                return profile;
              }
            });
          }
          return record;
        } catch (error) {
          console.log(error);
          profile = {
            error: error,
          };
          return profile;
        }
      } else {
        console.log("User already in database");
        return found;
      }
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
