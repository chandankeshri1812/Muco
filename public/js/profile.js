"use strict";

const saveChanges = document.querySelector("#usr_info_save-changes");
const passwordChange = document.querySelector("#usr_confirm-change-pwd");
const appendAlert = (message, timer) => {
  const alertBox = document.querySelector(".alert");
  alertBox.innerText = message;
  alertBox.classList.remove("hidden");
  setTimeout(() => {
    alertBox.classList.add("hidden");
  }, timer || 3000);
};
const changeprofile = async (reqBody, url, message) => {
  const promise = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(reqBody),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (message == "Password-change") {
    appendAlert("Please Wait", 2000);
  }
  const res = await promise.json();
  appendAlert(res.message);
  if (res.status == "success" && message == "Profile-change") {
    document.querySelector(".nav__profile__user-name").innerText =
      res.data.value.name;
    document.querySelector(".nav__profile__user-loc").innerText =
      res.data.value.city;
  }
  if (res.status == "success" && message == "Password-change") {
    window.setTimeout(() => {
      location.assign("/login");
    }, 4000);
  }
};
saveChanges.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("hello");
  let firstname = document.querySelector("#prf-first-name");
  firstname = firstname.value || firstname.getAttribute("placeholder");
  let lastname = document.querySelector("#prf-last-name");
  lastname = lastname.value || lastname.getAttribute("placeholder");
  const name = [firstname, lastname].join(" ");
  let city = document.querySelector("#prf-user-cityname");
  city = city.value || city.getAttribute("placeholder");
  const url = `/api/v1/users/updateMe`;
  changeprofile({ name, city }, url, "Profile-change");
});
passwordChange.addEventListener("click", (e) => {
  e.preventDefault();
  const currentPassword = document.querySelector("#usr_curr-pwd").value;
  const password = document.querySelector("#usr_new-pwd").value;
  const confirmpassword = document.querySelector("#usr_confirm-pwd").value;
  const url = "/api/v1/users/passwordUpdate";
  changeprofile(
    { currentPassword, password, confirmpassword },
    url,
    "Password-change"
  );
});

///////////////////////////////
////////////////////////////////City Review/////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

const getCityRating = async function (url) {
  const promise = await fetch(url);
  const res = await promise.json();
  if (res.status == "success") {
    appendcityRating(res.data.city);
  }
};
if (!document.querySelector(".timeline").dataset.cityid) {
  cityid = document.querySelector("#cityMsgMenuLeft").dataset.cityid;
}
const url = `/api/v1/city/getcityrating/${cityid}`;
getCityRating(url);

function appendcityRating(city) {
  document.querySelector(
    ".mucorp_Name"
  ).innerText = `${city.name} Municipal Corp.`;
  const municipality_img_container = document.querySelector(".mucorp__bg-img");
  municipality_img_container.setAttribute(
    "src",
    `/img/homepage/${city.name}.jpg`
  );
  const ratingBox = document.querySelector(".review_star_cont_main_page");
  const previousStar = ratingBox.children;
  [...previousStar].forEach((el) => el.remove());
  const rating = Math.round(city.averageRating);
  [1, 2, 3, 4, 5].forEach((el) => {
    if (el <= rating)
      ratingBox.insertAdjacentHTML(
        "beforeend",
        '<i class="fas active_view_review rating_view_review fa-star"></i>'
      );
    else
      ratingBox.insertAdjacentHTML(
        "beforeend",
        '<i class="fas  rating_view_review fa-star"></i>'
      );
  });
}
///////////////////////////////View ALl Review/////////////////////////
const viewAllReview = document.querySelector("#up-new-post2");
viewAllReview.addEventListener("click", (el) => {
  location.assign(`/viewAllReview/${cityid}`);
});

/////////////////////////Logout////////////////////////
//////////////////////////////////////////////////////

const logout_button = document.querySelector(".nav__Logout");
logout_button.addEventListener("click", () => {
  window.setTimeout(() => {
    location.assign("/logout");
  }, 1500);
});

/////////////////////////////City Drop down and change in Right bar////////////////////////////
let cityDrop_Down = document.querySelector(".nav__city-dropdown");
cityDrop_Down.addEventListener("click", (e) => {
  //console.log(e.target.innerText);

  cityid = e.target.dataset.cityid;
  document
    .querySelector("#cityMsgMenuLeft")
    .setAttribute("data-cityid", cityid);
  const url = `/api/v1/city/getcityrating/${cityid}`;
  getCityRating(url);
});
