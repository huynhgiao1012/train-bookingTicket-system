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
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
getData(`http://localhost:3000/api/v1/trip/getTripById/${id}`).then(
  (result) => {
    if (!result.success) {
      $("body").append(`
                  <h1>Errror</h1>
              `);
    } else {
      $("body").append(`
      <header>
      <div class="hleft">
        <img
          src="https://github.com/MayPham2571/train-booking-ticket-system/blob/main/UI/Asset/logo@2x.png?raw=true"
          alt=""
        />
      </div>
      <div class="hright">
        <a class="lg" href="FirstPage.html">Logout</a>
      </div>
    </header>
    <div class="container">
      <div class="head">
        <h3>Update Trip</h3>
        <div class="back">
          <i class="fas fa-less-than"></i>
          <a href="ManageTrip.html">Back</a>
        </div>
      </div>
      <div class="content">
        <h1>Update Trip</h1>
        <div class="form">
          <table>
            <tr>
              <th><label for="source">Source</label></th>
              <td><input type="text" id="source" name="source" required value="${
                result.data.source
              }" /></td>
            </tr>
            <tr>
              <th><label for="destination">Destination</label></th>
              <td>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  required
                  value="${result.data.destination}"
                />
              </td>
            </tr>
            <tr>
              <th><label for="Date">Date</label></th>
              <td><input type="date" id="Date" name="Date" required value="${result.data.Date.slice(
                0,
                10
              )}" /></td>
            </tr>
            <tr>
              <th><label for="StartTime">StartTime</label></th>
              <td>
                <input type="time" id="StartTime" name="StartTime" required value="${
                  result.data.StartTime
                }" />
              </td>
            </tr>
            <tr>
              <th><label for="EndTime">EndTime</label></th>
              <td>
                <input type="time" id="EndTime" name="EndTime" required value="${
                  result.data.EndTime
                }" />
              </td>
            </tr>
            <tr>
              <th><label for="price">Price</label></th>
              <td><input type="number" id="price" name="price" required value="${
                result.data.price
              }" /></td>
            </tr>
            <tr>
              <th></th>
              <td>
                <button class="updateBtn" onclick="update()">Update</button>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
      `);
    }
  }
);
const update = () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const result = {
    source: document.getElementById("source").value,
    destination: document.getElementById("destination").value,
    Date: document.getElementById("Date").value,
    StartTime: document.getElementById("StartTime").value,
    EndTime: document.getElementById("EndTime").value,
    price: document.getElementById("price").value,
  };
  Object.keys(result).forEach((key) => {
    if (result[key] === "") {
      alert("Please enter full required information");
    }
  });
  console.log(JSON.stringify(result));
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify(result),
  };
  console.log(options);
  fetch(`http://localhost:3000/api/v1/trip/${id}`, options)
    .then((response) => response.json()) // chuyển kết quả trả về thành json object
    .then((result) => {
      if (result.success) {
        alert("Update Successfully");
      }
    })
    .catch((error) => {
      console.error("Error:", error); // ghi log nếu xảy ra lỗi
    });
};
