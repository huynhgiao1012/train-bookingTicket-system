$("#btn-submit").click(function (e) {
  e.preventDefault();
  const result = {
    email: document.getElementById("email").value,
  };
  console.log(JSON.stringify(result));
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  };
  console.log(options);
  fetch("http://localhost:3000/api/v1/auth/forgetPassword", options)
    .then((response) => response.json()) // chuyển kết quả trả về thành json object
    .then((result) => {
      alert(result.message);
    })
    .catch((error) => {
      console.error("Error:", error); // ghi log nếu xảy ra lỗi
    });
});
