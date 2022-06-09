$(".getOTP").click(function (e) {
  e.preventDefault();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  console.log(options);
  fetch(`http://localhost:3000/api/v1/ticket/checkBalance/${id}`, options)
    .then((response) => response.json()) // chuyển kết quả trả về thành json object
    .then((result) => {
      alert(result.message);
    })
    .catch((error) => {
      console.error("Error:", error); // ghi log nếu xảy ra lỗi
    });
});

$(".Pay").click(function (e) {
  e.preventDefault();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const result = {
    OTP: document.getElementById("OTP").value,
  };
  if (!result.OTP) {
    alert("Please enter OTP code");
  } else {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(result),
    };
    console.log(options);
    fetch(`http://localhost:3000/api/v1/ticket/payTicket/${id}`, options)
      .then((response) => response.json()) // chuyển kết quả trả về thành json object
      .then((result) => {
        console.log(result);
        if (result.message === "Cannot read property 'otp' of null") {
          alert("Have paid !");
        } else if (result.message === "OTP code is not corrrect !") {
          alert(result.message);
        } else {
          alert(result.message);
          location.replace("http://127.0.0.1:5500/FE/Payment.html");
        }
      })
      .catch((error) => {
        console.error("Error:", error); // ghi log nếu xảy ra lỗi
      });
  }
});
