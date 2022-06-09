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

const loadTrippage = () => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const url = "http://localhost:3000/api/v1/trip/getAllTrip";
  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      console.log(result.data);
      if (!result.success) {
          
        $(".trip").append(`
                        <h1>Error</h1>
                    `);
      } else {
        if (result.data.length === 0) {
          $(".uncreate").empty();

          $(".uncreate").append(`
              <h1>Don't have any trip!</h1>
            `);
        } else {
          for (i = 0; i < result.data.length; i++) {
            $(".trip").append(`
            <div class="item">
                <div>
                    <h4>FROM:</h4>
                    <h2>${result.data[i].source}</h2>  
                </div>
                <div>
                    <h4>TO:</h4>
                    <h2>${result.data[i].destination}</h2>
                </div>
                <div>
                    <h4>DATE:</h4>
                    <h2>${result.data[i].Date.slice(0, -14)}</h2>
                </div>
                
                <button class="dropbtn" onclick="detailTrip(event, 'below${i}', '${
                    result.data[i]._id
                  }' )">DETAIL</button>
          </div>
          
          <div id="myDropdown${i}" class="show">
            
            <div class="detail">
                
                <h2>The route</h2>
                <div class="inside">
                    <div>
                        <h4>${result.data[i].StartTime}</h4><br>
                        <img src="/UI/Asset/train-1.png" style="width: 19px; height: 28px; margin-bottom:122.5px; margin-left: 15px;"><br>
                        <h4>${result.data[i].EndTime}</h4>
                    </div>
                    <div>
                        <img src="/UI/Asset/route.png" class="icon">
                    </div>
                    <div>
                        <h3 >${result.data[i].source}</h3>
                        <h3>${result.data[i].destination}</h3>
                    </div>
                    <div class="para">
                        <p>Number of seat: ${result.data[i].NumOfSeat} 
                        <br>Cost: ${result.data[i].price} VND</p>
                    </div>
                </div>
                
            </div>
            <hr/>
   
         `);
          }
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

loadTrippage();

const detailTrip = (evt, detail, tripID) => {
  const a = detail.slice(-1);
  
  document.getElementById(`myDropdown${a}`).classList.toggle("route");

  const data = {
      tripID : tripID,
  }

  postData("http://localhost:3000/api/v1/trip", data).then((result) => {
    console.log(result);
  });
};
