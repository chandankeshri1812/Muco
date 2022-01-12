const catchAsync = require("./../utlis/catchAsync");
const AppError = require("./../utlis/appError");
const Post = require("./../Models/postModel");
const City = require("./../Models/cityModel");
const axios = require("axios");
const express = require("express");
const router = express.Router();
exports.login = (req, res, next) => {
  res.status(200).render("login", {
    title: "Muco| Login",
  });
};
exports.logout = (req, res, next) => {
  res.cookie("jwt", "");
  res.redirect("/");
};
exports.home = (req, res, next) => {
  const user = res.locals.user;
  if (user) {
    res.status(200).render("homepage", {
      title: "Muco| Home",
    });
  }
  if (!user) {
    res.status(400).render("err", {
      error: "Something went wrong,Login again",
      status: 400,
    });
  }
};
exports.homepage = (req, res, next) => {
  //console.log("Hello", res.locals.user);
  const user = res.locals.user;
  if (user) {
    res.status(200).render("home", {
      title: "Muco| Home",
    });
  }
  if (!user) {
    res.status(400).render("err", {
      error: "Something went wrong,Login again",
      status: 400,
    });
  }
};
exports.yourPosts = (res, req, next) => {
  const user = res.locals.user;
  if (user) {
    res.status(200).render("yourPosts", {
      title: "Muco| Your Posts",
    });
  }
  if (!user) {
    res.status(400).render("err", {
      error: "Something went wrong,Login again",
      status: 400,
    });
  }
};
exports.signupverified = async (req, res, next) => {
  try {
    const response = await axios({
      method: "PATCH",
      url: `${req.protocol}://${req.get("host")}/api/v1/users/signup/${
        req.params.verifyToken
      }`,
    });
    const keys = Object.keys(response.headers).filter(
      (el) => el == "set-cookie"
    )[0];
    const token = response.headers[keys][0].split("=")[1].split(";")[0];
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    res.cookie("jwt", token, cookieOptions);
    if (response.status == 200) {
      //console.log("Cookies ", req.cookies.jwt);
      return res.redirect("/home");
    }
  } catch (err) {
    //console.log(err);
    res.status(400).render("err", {
      error: "Something went wrong,signup again",
      status: 400,
    });
  }
};

exports.postDetail = async (req, res, next) => {
  const user = res.locals.user;
  if (!user) {
    res.status(400).render("err", {
      error: "Something went wrong,Login again",
      status: 400,
    });
  }
  const post = await Post.findById(String(req.params.postid));
  res.status(200).render("postdetail", {
    title: "Muco| Post Detail",
    post,
  });
};

exports.viewAllReview = async (req, res, next) => {
  const user = res.locals.user;
  if (!user) {
    res.status(400).render("err", {
      error: "Something went wrong,Login again",
      status: 400,
    });
  }
  const city = await City.findById(req.params.cityId);
  //console.log(city);
  if (city)
    res.status(200).render("viewReview", {
      title: "Muco| Reviews",
      cityid: city._id,
    });
  if (!city) {
    res.status(400).render("err", {
      error: "No city found",
      status: 400,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  const token = req.params.resetToken;
  res.status(200).render("resetform", {
    title: "Muco| Reset Password",
    token,
  });
};
