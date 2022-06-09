async function updateData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "PATCH",
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
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
getData(`http://localhost:3000/api/v1/user//detail/${id}`).then((result) => {
  if (!result.success) {
    $("body").append(`
                    <h1>Errror</h1>
                `);
  } else {
    $("body").append(`<header>
        <div class="left">
            <img
              src="https://github.com/MayPham2571/train-booking-ticket-system/blob/main/UI/Asset/logo@2x.png?raw=true"
              alt=""
            />
        </div>
        <div class="right">
            <a class="lg" href="ViewPage.html">Logout</a>
        </div>
    </header>
    <main>
        <div class="container">
            <div class="head">
                <h3>UPDATE USER</h3>
                <div class="back">
                  <i class="fas fa-less-than"></i>
                  <a href="ManageUser.html">Back</a>
                </div>
              </div>
              <div class="content">
                <h1>User's Information</h1>
                <div class="inside">
                  <div class="box">
                      <form action="">
                        <div class="line">
                            <label for="name">Full Name:</label>
                            <input type="text" id="name" name="name"  value = "${
                              result.data.name
                            }" required>
                        </div>
                        <div class="line">
                            <label for="dob">Date of Birth:</label>
                            <input type="date" id="dob" name="dob" value = "${result.data.dob.slice(
                              0,
                              10
                            )}"required>
                        </div>
                        <div class="line">
                            <label for="address">Address:</label>
                            <input type="text" id="address" name="address"value = "${
                              result.data.address
                            }" required>
                        </div>
                        <div class="line">
                            <label for="phone">Phone numbers:</label>
                            <input type="text" id="phone" name="phone" value = "${
                              result.data.phone
                            }"required>
                        </div>
                        <div class="line">
                            <label for="idCard">Identification Card:</label>
                            <input type="text" id="idCard" name="idCard" value = "${
                              result.data.idCard
                            }"required>
                        </div>
                          <button type="submit" id="update-btn">Update information</button>
                      </form>
                    
                  </div>
                </div>
              </div>         
        </div>
    </main>`);
  }
});
$(document).on("click", "#update-btn", function (e) {
  e.preventDefault();
  const resultdata = {
    dob: document.getElementById("dob").value,
    name: document.getElementById("name").value,
    address: document.getElementById("address").value,
    phone: document.getElementById("phone").value,
    idCard: document.getElementById("idCard").value,
  };
  updateData(`http://localhost:3000/api/v1/user/${id}`, resultdata).then(
    (result) => {
      if (!result.success) {
        alert(result.message);
      } else {
        alert(result.message);
        window.location.replace("ManageUser.html");
      }
    }
  );
});
$(document).on("click", ".lg", function (e) {
  e.preventDefault();
  window.localStorage.clear();
  window.location.replace("FirstPage.html");
});
