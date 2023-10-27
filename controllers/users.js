const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const UsersModel = require("../models/User.js");
const SessionModel = require("../models/Session.js");

//hàm xử lý việc đăng ký
const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    const err = [];
    errors.array().map((error) => {
      err.push({ msg: error.msg, path: error.path });
    });
    // console.log(err);
    if (!errors.isEmpty()) {
      return res.status(400).json({ err: err });
    } else {
      const existingUser = await UsersModel.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(409).json({ err: [], message: "Existing user!" });
      } else {
        const newUser = new UsersModel({
          email: req.body.email,
          pass: bcrypt.hashSync(req.body.pass, 8),
          name: req.body.name,
        });
        await newUser.save();
        return res.status(201).json({ err: [], message: "Created!" });
      }
    }
  } catch (err) {
    return res.redirect("http://localhost:3000/server-error");
  }
};
//hàm xử lý việc đăng nhập
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    const err = [];
    errors.array().map((error) => {
      err.push({ msg: error.msg, path: error.path });
    });
    if (!errors.isEmpty()) {
      return res.status(400).json({ err: err });
    } else {
      const existingUser = await UsersModel.findOne({ email: req.body.email });
      if (existingUser) {
        const correctPass = bcrypt.compareSync(
          req.body.pass,
          existingUser.pass
        );
        if (correctPass) {
          const id = (Math.random() * 10).toString();
          req.session.isLoggedIn = true;
          req.session.user = {
            _id: id,
            email: existingUser.email,
          };
          return res
            .status(200)
            .json({ err: [], message: "You are logged in!", user: id });
        } else {
          return res
            .status(400)
            .json({ err: [], message: "Wrong email or password" });
        }
      } else {
        return res
          .status(400)
          .json({ err: [], message: "Wrong email or password" });
      }
    }
  } catch (err) {
    return res.redirect("http://localhost:3000/server-error");
  }
};
//hàm kiểm tra người dùng đã đăng nhập chưa
const checkLogin = async (req, res) => {
  try {
    const session = await SessionModel.findOne({
      "session.user._id": req.params.user,
    });
    if (session) {
      res.status(200).json({ err: [], message: "You are logged in" });
    } else {
      res.status(400).json({ err: [], message: "have not been logged in yet" });
    }
  } catch (err) {
    return res.redirect("http://localhost:3000/server-error");
  }
};
//hàm xử lý việc đăng xuất
const logout = async (req, res) => {
  try {
    await SessionModel.deleteOne({
      "session.user._id": req.params.user,
    });
    return res.status(200).json({ message: "You are logged out!" });
  } catch (err) {
    return res.redirect("http://localhost:3000/server-error");
  }
};
module.exports = { signup, login, checkLogin, logout };
