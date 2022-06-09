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

$(".searchTrip").click(function (e) {
  e.preventDefault();
  const result = {
    source: document.getElementById("source").value,
    destination: document.getElementById("destination").value,
  };
  console.log(result);
  if (result.source === "" || result.destination === "") {
    alert("Please choose source/destination");
  } else {
    postData("http://localhost:3000/api/v1/trip/", result).then((result) => {
      console.log(result);
      $(".list").empty();
      result.data.forEach((value) => {
        $(".list").append(`
      <li class="ticket${value._id}">
              <div class="line">
                <div>
                    <h4>Source</h4>
                    <h4 class="data">${value.source}</h4>
                </div>
                <div>
                    <h4>Destination</h4>
                    <h4 class="data">${value.destination}</h4>
                </div>
                  <div>
                      <h4>Date</h4>
                      <h4 class="data">${value.Date.slice(0, -14)}</h4>
                  </div>
                  <div>
                      <h4>Time</h4>
                      <h4 class="data">${value.StartTime}-${value.EndTime}</h4>
                  </div>
                  <div>
                      <h4>Number Of Seat</h4>
                      <h4 class="data">${value.NumOfSeat}</h4>
                  </div>
                  <div>
                      <h4>Price</h4>
                      <h4 class="data">${value.price}</h4>
                  </div>
              </div>
      <button
        id="${value._id}"
        class="delete-btn"
        onclick="deleteTicket(event, '${value._id}')"
      >
        Delete
      </button>
      <button
        id="${value._id}"
        class="update-btn"
        onclick="updateTrip(event, '${value._id}')"
      >
        Update
      </button>
    </li>
      `);
      });
    });
  }
});
const deleteTicket = (evt, id) => {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const url = `http://localhost:3000/api/v1/trip/${id}`;
  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        alert("Delete successfully");
        $(`.ticket${id}`).remove();
      }
    });
};
const updateTrip = (evt, id) => {
  location.assign(`http://127.0.0.1:5500/FE/UpdateTrip.html?id=${id}`);
};
