async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify(data),
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
async function getData(url = "") {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
const rendeUser = (arr) => {
  $(".list").empty();
  arr.forEach((value, index) => {
    $(".list").append(`  <li class="user${value._id}">
<span>${index + 1}<span id = "email">${value.email}</span></span>
<div class="btn-box">
    <a href="UpdateUser.html?id=${value._id}" class="button">Update</a>
    <button id="${
      value._id
    }" class="delete-btn button" onclick="deleteUser(event, '${
      value._id
    }')">Delete</button>
    <a href="RechargeBalanceUser.html?id=${
      value._id
    }" class="button">Recharge Balance</a>
</div>
</li>`);
  });
};
getData("http://localhost:3000/api/v1/user/").then((result) => {
  var filterArr = result.data.filter(
    (value) => value.role === "user"
  ).sort(function(a,b){
    let x = a.email.toLowerCase();
    let y = b.email.toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
  });
  console.log(filterArr)
    rendeUser(filterArr);
  });
$("#email").on("keyup", function () {
  const letter = this.value;
  getData("http://localhost:3000/api/v1/user/").then((result) => {
    var filterArr = result.data.filter(
      (value) => value.email.includes(letter) && value.role === "user"
    ).sort(function(a,b){
      let x = a.email.toLowerCase();
      let y = b.email.toLowerCase();
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    });
    rendeUser(filterArr);
  });
});
const deleteUser = (evt, id) => {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const url = `http://localhost:3000/api/v1/user/${id}`;
  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      $(`.user${id}`).remove();
    });
  }
  $(document).on("click", ".lg", function (e) {
    e.preventDefault();
    window.localStorage.clear();
    window.location.replace("FirstPage.html");
  });