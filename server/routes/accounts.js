"use strict";
const mongoose = require("mongoose");
const Account = require("./../models/Account");

exports.plugin = {
  name: "api",
  register: (server, options) => {
    server.route({
      method: "GET",
      path: "/account",

      handler: (req, h) => {
        return "OKKK";
        return Account.find((err, res) => {
          if (err) {
            return err;
          }
          return res;
        });
      },
    });
  },
};
