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
$(".search").click(function (e) {
  e.preventDefault();
  const resultdata = {
    source: document.getElementById("source").value,
    destination: document.getElementById("destination").value,
  };
  if (resultdata.source === "") {
    alert("Please choose source !");
  } else if (resultdata.destination === "") {
    alert("Please choose destination !");
  } else {
    console.log(resultdata.source);
    postData("http://localhost:3000/api/v1/trip/", resultdata).then(
      (result) => {
        console.log(result.success);
        //console.log(result.data[0]._id);
        if (result.success === false) {
          alert(result.message);
        }
        $(".getTrip").empty();
        $(".getTrip").append(`
          <h2>${result.data[0].source} - ${result.data[0].destination}</h2>
                `);
        for (i = 0; i < result.data.length; i++) {
          $(".getTrip").append(`
          <div class="trip">
                <div class="title">
                  <div class="tleft">
                    <div>
                      <h4>Date</h4>
                      <p>${result.data[i].Date.slice(0, -14)}</p>
                    </div>
                    <div>
                      <h4>StartTime</h4>
                      <p>${result.data[i].StartTime}</p>
                    </div>
                    <div>
                      <h4>EndTime</h4>
                      <p>${result.data[i].EndTime}</p>
                    </div>
                    <div>
                      <h4>Price</h4>
                      <p>${result.data[i].price}</p>
                    </div>
                  </div>
                  <div class="tright">
                    <button onclick="openSeat(event, 'below${i}', '${
            result.data[i]._id
          }')" class="dropbtn">Choose Seat</button>
                  </div>
                </div>
                <div id="myDropdown${i}" class="dropdown-content">
                  <div class="below" id="below${i}">
                    <hr/>
                    <div id="seatNum" class="seatNum">
                      <div class="left left${i}"></div>
                      <div class="right right${i}"></div>
                      <div class="bBtn">
                        <button
                          id="btn${i}"
                          class="btnhehe"
                          onclick="book(event, 'below${i}')"
                        >
                          Book
                        </button>
                        <div>
                        <span class="circle available"></span>
                          <h4>Available</h4>
                        </div>
                        <div>
                        <span class="circle booked"></span>
                          <h4>Booked</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                `);
        }
      }
    );
  }
});

const loadSourceDes = () => {
  getData("http://localhost:3000/api/v1/trip/getAllTrip").then((result) => {
    var source = [];
    var des = [];
    for (i = 0; i < result.data.length; i++) {
      if (!source.includes(result.data[i].source)) {
        source.push(result.data[i].source);
        $(".source").append(`
        <option value="${result.data[i].source}">${result.data[i].source}</option>
        `);
      }
      if (!des.includes(result.data[i].destination)) {
        des.push(result.data[i].destination);
        $(".destination").append(`
        <option value="${result.data[i].destination}">${result.data[i].destination}</option>
        `);
      }
    }
  });
};

const openSeat = (evt, stepName, tripID) => {
  const a = stepName.slice(-1);
  document.getElementById(`myDropdown${a}`).classList.toggle("show");
  $(`.left${a}`).empty();
  $(`.right${a}`).empty();
  const data = {
    tripID: tripID,
  };
  postData("http://localhost:3000/api/v1/trip/getSeat", data).then((result) => {
    console.log(result);
    for (i = 0; i < result.data.length; i++) {
      console.log(result.data[i]);
      if (i % 2 === 0) {
        $(`.left${a}`).append(`
        <input type="radio" id="${stepName}&${
          i + 1
        }" name="SeatCheck" value="${tripID}&${i + 1}">
        <label for="${stepName}&${i + 1}">
        <span class="spanActive${stepName}${i + 1}">${i + 1}</span>
          <i class="icon${stepName}${i + 1} fa-solid fa-couch"></i>
        </label>
     `);
      } else {
        $(`.right${a}`).append(`
        <input type="radio" id="${stepName}&${
          i + 1
        }" name="SeatCheck" value="${tripID}&${i + 1}">
        <label for="${stepName}&${i + 1}">
          <span class="spanActive${stepName}${i + 1}">${i + 1}</span>
          <i class="icon${stepName}${i + 1} fa-solid fa-couch"></i>
        </label>
     `);
      }
    }
    for (i = 0; i < result.data.length; i++) {
      if (!result.data[i].SeatStatus) {
        document.getElementById(`${stepName}&${i + 1}`).value = "cantbook";
        const el = document.querySelector(`.spanActive${stepName}${i + 1}`);
        const el2 = document.querySelector(`.icon${stepName}${i + 1}`);
        el.style.color = "#ba131a";
        el2.style.color = "#ba131a";
      }
    }
  });
};

const chooseAgain = () => {
  document.getElementById("Step1content").style.display = "flex";
  document.getElementById("stepBtn").style.display = "none";
  $(".getTrip").empty();
};
const book = (evt, stepName) => {
  var checkbox = document.getElementsByName("SeatCheck");
  const resultdata = {
    source: document.getElementById("source").value,
    destination: document.getElementById("destination").value,
  };
  var seatNum;
  for (var i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked === true) {
      seatNum = checkbox[i].value;
    }
  }
  if (!seatNum) {
    alert("Please choose seat number !");
  } else if (seatNum === "cantbook") {
    alert("This position is not available !");
  } else {
    document.getElementById("seatNum").style.display = "none";
    document.getElementById("Step1content").style.display = "none";
    $(".getTrip").empty();
    $(".getTrip").append(`
          <div class="confirmSeat">
            <h2>From ${resultdata.source} TO ${resultdata.destination}</h2>
            <div><label for="seatNumber">Seat Number: ${
              seatNum.split("&")[1]
            }</label><input hidden type="text" id="seatNumber" value="${seatNum.split(
      "&"
    )}" readonly>
            </div>
          </div>
                `);
    document.getElementById("stepBtn").style.display = "block";
  }
};
const openStep = (evt, stepName) => {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(stepName).style.display = "block";
  evt.currentTarget.className += " active";
};
const eventButton = () => {
  const previousBtn = document.getElementById("previousBtn");
  const nextBtn = document.getElementById("nextBtn");
  const previousBtn2 = document.getElementById("previousBtn2");
  const nextBtn2 = document.getElementById("nextBtn2");
  const nextBtn3 = document.getElementById("nextBtn3");
  const Continue = document.getElementById("Continue");
  const bullets = [...document.querySelectorAll(".bullet")];
  const MAX_STEPS = 4;
  let currentStep = 1;
  nextBtn.addEventListener("click", () => {
    bullets[currentStep - 1].classList.add("completed");
    currentStep += 1;
    if (currentStep === MAX_STEPS) {
      nextBtn.disabled = true;
      finishBtn.disabled = false;
    }
    const resultdata = {
      source: document.getElementById("source").value,
      destination: document.getElementById("destination").value,
    };
    postData("http://localhost:3000/api/v1/trip/", resultdata).then(
      (result) => {
        var checkbox = document.getElementById("seatNumber");
        console.log(checkbox.value.split(",")[1]);
        for (j = 0; j < result.data.length; j++) {
          if (checkbox.value.split(",")[0] === result.data[j]._id) {
            console.log(result.data[j]);
            $(".routeInfo").empty();
            $(".routeInfo").append(`
              <table>
              <tr>
                <th>Source</th>
                <td>${result.data[j].source}</td>
              </tr>
              <tr>
                <th>Destination</th>
                <td>${result.data[j].destination}</td>
              </tr>
              <tr>
                <th>Date</th>
                <td>${result.data[j].Date.slice(0, -14)}</td>
              </tr>
              <tr>
                <th>StartTime</th>
                <td>${result.data[j].StartTime}</td>
              </tr>
              <tr>
                <th>EndTime</th>
                <td>${result.data[j].EndTime}</td>
              </tr>
              <tr>
                <th>Seat Number</th>
                <td>${checkbox.value.split(",")[1]}</td>
              </tr>
              <tr>
                <th>Price</th>
                <td>${result.data[j].price}</td>
              </tr>
            </table>
              `);
          }
        }
      }
    );
  });
  previousBtn.addEventListener("click", () => {
    bullets[currentStep - 2].classList.remove("completed");
    currentStep -= 1;
    nextBtn.disabled = false;
    finishBtn.disabled = true;
    if (currentStep === 1) {
      previousBtn.disabled = true;
    }
  });
  nextBtn2.addEventListener("click", () => {
    bullets[currentStep - 1].classList.add("completed");
    currentStep += 1;
    previousBtn.disabled = false;
    if (currentStep === MAX_STEPS) {
      nextBtn.disabled = true;
      finishBtn.disabled = false;
    }
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    const url = "http://localhost:3000/api/v1/user/detail";
    fetch(url, options)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (!result.success) {
          $(".infoConfirm").append(`
                        <h1>Errror</h1>
                    `);
        } else {
          $(".infoConfirm").empty();
          $(".infoConfirm").append(`
  
              <table>
                <tr>
                  <th>Full name:</th>
                  <td>${result.data.name}</td>
                </tr>
                <tr>
                  <th>Date of birth:</th>
                  <td>${result.data.dob.slice(0, -14)}</td>
                </tr>
                <tr>
                  <th>Address:</th>
                  <td>${result.data.address}</td>
                </tr>
                <tr>
                  <th>Phone number:</th>
                  <td>${result.data.phone}</td>
                </tr>
                <tr>
                  <th>ID card number:</th>
                  <td>${result.data.idCard}</td>
                </tr>
              </table>
                    `);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
  previousBtn2.addEventListener("click", () => {
    bullets[currentStep - 2].classList.remove("completed");
    currentStep -= 1;
    nextBtn.disabled = false;
    finishBtn.disabled = true;
    if (currentStep === 1) {
      previousBtn.disabled = true;
    }
  });
  nextBtn3.addEventListener("click", () => {
    bullets[currentStep - 1].classList.add("completed");
    currentStep += 1;
    bullets[currentStep - 1].classList.add("completed");
    if (currentStep === MAX_STEPS) {
      Continue.disabled = false;
    }
    var checkbox = document.getElementById("seatNumber");
    const data = {
      tripID: checkbox.value.split(",")[0],
      Seatnumber: checkbox.value.split(",")[1],
    };
    postData("http://localhost:3000/api/v1/ticket/bookticket", data).then(
      (result) => {
        if (result.success) {
          $(".step4").empty();
          $(".step4").append(`
              <h1>Book Successfully !</h1>
            `);
        }
      }
    );
  });
  Continue.addEventListener("click", () => {
    for (i = 1; i <= MAX_STEPS; i++) {
      bullets[currentStep - i].classList.remove("completed");
    }
    currentStep -= 3;
    if (currentStep === 1) {
      nextBtn.disabled = false;
    }
    document.getElementById("Step1content").style.display = "flex";
    $(".getTrip").empty();
    document.getElementById("stepBtn").style.display = "none";
  });
};
eventButton();
loadSourceDes();

$(document).on("click", ".logout", function (e) {
  e.preventDefault();
  window.localStorage.clear();
  window.location.replace("FirstPage.html");
});

// load source
const loadSource = () => {
  getData("http://localhost:3000/api/v1/trip/getSource").then((result) => {
    for (i = 0; i < result.newData.length; i++) {
      $(".dropSource").append(`
      <p class="s${i + 1}">${result.newData[i]}</p>
      `);
    }
  });
};
const loadDes = () => {
  getData("http://localhost:3000/api/v1/trip/getDestination").then((result) => {
    for (i = 0; i < result.newData.length; i++) {
      $(".dropDes").append(`
      <p class="d${i + 1}">${result.newData[i]}</p>
      `);
    }
  });
};
loadSource();
loadDes();
function myFunction() {
  $("#dropdownSource").toggle();
  $("#dropdownDes").hide();
  //document.getElementById("dropdownSource").classList.toggle("show");
  const list = document.getElementById("dropdownSource");
  p = list.getElementsByTagName("p");
  for (i = 0; i < p.length; i++) {
    $(`.s${i + 1}`).click(function (e) {
      input = document.getElementById("source");
      input.value = $(this).text();
      $("#dropdownSource").hide();
    });
  }
}
function myFunction2() {
  $("#dropdownDes").toggle();
  $("#dropdownSource").hide();
  const list = document.getElementById("dropdownDes");
  p = list.getElementsByTagName("p");
  for (i = 0; i < p.length; i++) {
    $(`.d${i + 1}`).click(function (e) {
      input = document.getElementById("destination");
      input.value = $(this).text();
      $("#dropdownDes").hide();
    });
  }
}
function filterFunction() {
  var input, filter, a, i;
  input = document.getElementById("source");
  filter = input.value.toUpperCase();
  div = document.getElementById("dropdownSource");
  a = div.getElementsByTagName("p");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}
function filterFunction2() {
  var input, filter, a, i;
  input = document.getElementById("destination").value;
  filter = input.toUpperCase();
  div = document.getElementById("dropdownDes");
  a = div.getElementsByTagName("p");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}
