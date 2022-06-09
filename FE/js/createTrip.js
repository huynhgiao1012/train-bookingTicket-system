$(".createBtn").click(function (e) {
  e.preventDefault();
  const result = {
    source: document.getElementById("source").value,
    destination: document.getElementById("destination").value,
    Date: document.getElementById("Date").value,
    StartTime: document.getElementById("StartTime").value,
    EndTime: document.getElementById("EndTime").value,
    price: document.getElementById("price").value,
    NumOfSeat: document.getElementById("NumOfSeat").value,
  };
  console.log(JSON.stringify(result));
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify(result),
  };
  console.log(options);
  fetch("http://localhost:3000/api/v1/trip/createTrip", options)
    .then((response) => response.json()) // chuyển kết quả trả về thành json object
    .then((result) => {
      if (result.success) {
        alert("Create Successfully");
      }
    })
    .catch((error) => {
      console.error("Error:", error); // ghi log nếu xảy ra lỗi
    });
});
