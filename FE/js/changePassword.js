$("#pw-submit").click(function (e) {
  e.preventDefault();
  const result = {
    oldPassword: document.getElementById("oldPassword").value,
    newPassword: document.getElementById("newPassword").value,
  };
  console.log(JSON.stringify(result));
  if (!result) {
    alert("Please enter information");
  } else {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(result),
    };
    fetch(`http://localhost:3000/api/v1/auth/updatePassword`, options)
      .then((response) => response.json()) // chuyển kết quả trả về thành json object
      .then((result) => {
        alert(result.message);
      })
      .catch((error) => {
        console.error("Error:", error); // ghi log nếu xảy ra lỗi
      });
  }
});
$(document).on("click", ".lg", function (e) {
  e.preventDefault();
  window.localStorage.clear();
  window.location.replace("FirstPage.html");
});
