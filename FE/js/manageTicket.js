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

$(".searchTicket").click(function (e) {
  e.preventDefault();
  const result = {
    email: document.getElementById("email").value,
  };
  if (result.email === "") {
    alert("Please enter email");
  }
  postData(
    "http://localhost:3000/api/v1/ticket/searchTicketByMail",
    result
  ).then((result) => {
    $(".list").empty();
    result.data.forEach((value) => {
      $(".list").append(`
    <li class="ticket${value._id}">
            <div class="line">
                <div>
                    <h4>Source</h4>
                    <h4 class="data">${value.tripID.source}</h4>
                </div>
                <div>
                    <h4>Destination</h4>
                    <h4 class="data">${value.tripID.destination}</h4>
                </div>
                <div>
                    <h4>Date</h4>
                    <h4 class="data">${value.tripID.Date.slice(0, -14)}</h4>
                </div>
                <div>
                    <h4>Time</h4>
                    <h4 class="data">${value.tripID.StartTime}-${
        value.tripID.EndTime
      }</h4>
                </div>
                <div>
                    <h4>SeatNumber</h4>
                    <h4 class="data">${value.Seatnumber}</h4>
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
  </li>
    `);
    });
  });
});

const deleteTicket = (evt, id) => {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const url = `http://localhost:3000/api/v1/ticket/${id}`;
  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      alert("Delete successfully");
      $(`.ticket${id}`).remove();
    });
};
