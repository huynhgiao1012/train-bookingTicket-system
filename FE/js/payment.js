const loadTicketpage = () => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const url = "http://localhost:3000/api/v1/ticket/getUnpaidTicket";
  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      console.log(result.data);
      if (!result.success) {
        $(".ticket").append(`
                      <h1>Errror</h1>
                  `);
      } else {
        if (result.data.length === 0) {
          $(".unpaid").empty();
          $(".unpaid").append(`
            <h1>Don't have ticket that need to be paid</h1>
          `);
        } else {
          for (i = 0; i < result.data.length; i++) {
            $(".ticket").append(`
          <div class="item">
          <div>
            <h4>FROM:</h4>
            <h2>${result.data[i].tripID.source}</h2>
            <h4>TO:</h4>
            <h2>${result.data[i].tripID.destination}</h2>
          </div>
          <div>
            <h4>DATE:</h4>
            <h2>${result.data[i].tripID.Date.slice(0, -14)}</h2>
            <h4>COST:</h4>
            <h2>${result.data[i].price}</h2>
          </div>
          <div>
            <h4>TIME:</h4>
            <h2>${result.data[i].tripID.StartTime}-${
              result.data[i].tripID.EndTime
            }</h2>
            <h4>SEAT NUMBER:</h4>
            <h2>${result.data[i].Seatnumber}</h2>
          </div>
          <button class="${result.data[i]._id}" onclick="loadOTP(event, '${
              result.data[i]._id
            }')">PAY</button>
        </div>
            
                  `);
          }
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
loadTicketpage();

const loadOTP = (evt, id) => {
  console.log(id);
  location.assign(`http://127.0.0.1:5500/FE/OTP.html?id=${id}`);
};
