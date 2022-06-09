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

const loadUserDetailpage = () => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const url = "http://localhost:3000/api/v1/user/detail";
  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      if (!result.success) {
        $("body").append(`
                    <h1>Error</h1>
                `);
      } else {
        $("#balance").html(result.data.balance);
      }
    });
};

$(document).on("click", ".lg", function (e) {
  e.preventDefault();
  window.localStorage.clear();
  window.location.replace("FirstPage.html");
});

loadUserDetailpage();

const recharge = () => {
  const resultdata = {
    amount: +document.getElementById("amount").value,
    cardNum: document.getElementById("cardNum").value,
    CVV: document.getElementById("CVV").value,
    expiredDate: document.getElementById("expiredDate").value,
  };
  if (
    resultdata.amount === 0 ||
    resultdata.cardNum === "" ||
    resultdata.CVV === "" ||
    resultdata.expiredDate === ""
  ) {
    alert("Please fill all the information");
  } else {
    if (resultdata.cardNum.length < 16 || resultdata.cardNum.length > 16) {
      alert("Card number must include 16 characters");
    } else if (resultdata.CVV.length < 3 || resultdata.CVV.length > 4) {
      alert("CVV must include 3-4 characters");
    } else {
      postData(`http://localhost:3000/api/v1/user/recharge`, resultdata).then(
        (result) => {
          if (!result.success) {
            alert(result.message);
          }
        }
      );
    }
  }
};
