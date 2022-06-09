function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
$("#btn-submit").click(function (e) {
  e.preventDefault();
  const result = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
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
  fetch("http://localhost:3000/api/v1/auth/login", options)
    .then((response) => response.json()) // chuyển kết quả trả về thành json object
    .then((result) => {
      if(!result.success){
        alert(result.message); 
      }else{
        localStorage.setItem("token", result.token);
        if (localStorage.getItem("token")) {
          if(parseJwt(localStorage.getItem("token")).role === "user"){
            window.location.href = "homepage.html";
          }else{
            window.location.href = "AdminHomepage.html";
          }
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error); // ghi log nếu xảy ra lỗi
    });
});
$(".viewInfo").click(function (e) {
  e.preventDefault();
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  fetch("http://localhost:3000/api/v1/ticket/getTicket", options)
    .then((response) => response.json()) // chuyển kết quả trả về thành json object
    .then((result) => {
      console.log(result.data);
      document.querySelector(".rs").textContent = result.data[0].id;
    })
    .catch((error) => {
      console.error("Error:", error); // ghi log nếu xảy ra lỗi
    });
});
