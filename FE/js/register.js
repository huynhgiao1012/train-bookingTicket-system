$("#btn-submit").click(function (e) {
  e.preventDefault();
  const result = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    dob: document.getElementById("dob").value,
    name: document.getElementById("name").value,
    address: document.getElementById("address").value,
    phone: document.getElementById("phone").value,
    idCard: document.getElementById("idCard").value,
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
  fetch("http://localhost:3000/api/v1/auth/register", options)
    .then((response) => response.json()) // chuyển kết quả trả về thành json object
    .then((result) => {
      if (!result.success) {
        alert(Object.values(result.message)[0]);
      } else {
        fetch("http://localhost:3000/api/v1/auth/login", options1)
          .then((response) => response.json()) // chuyển kết quả trả về thành json object
          .then((result) => {
            localStorage.setItem("token", result.token);
            if (localStorage.getItem("token")) {
              window.location.href = "homepage.html";
            }
          })
          .catch((error) => {
            console.error("Error:", error); // ghi log nếu xảy ra lỗi
          });
      }
    })
    .catch((error) => {
      console.error("Error:", error); // ghi log nếu xảy ra lỗi
    });
  const result1 = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };
  const options1 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result1),
  };
  console.log(options);
});
