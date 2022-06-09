$("#btn-submit").click(function (e) {
  e.preventDefault();
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const userId = params.get("userId");
  const result = {
    newPassword: document.getElementById("newPassword").value,
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
  fetch(
    `http://localhost:3000/api/v1/auth/reset-password?token=${token}&userId=${userId}`,
    options
  )
    .then((response) => response.json()) // chuyển kết quả trả về thành json object
    .then((result) => {
      if(!result.success){
        alert(Object.values(result.message)[0]); 
      } else{
        alert(result.message)
      }
    })
    .catch((error) => {
      console.error("Error:", error); // ghi log nếu xảy ra lỗi
    });
});
