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
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
getData(`http://localhost:3000/api/v1/user/detail/${id}`).then((result) => {
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
            <a class="lg" href="FirstPage.html">Logout</a>
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
                            <input type="text" id="name" name="name"  value = "${result.data.name}"  disabled="disabled" required>
                        </div>
                        <div class="line">
                            <label for="balance">Current Balance:</label>
                            <input type="text" id="balance" name="balance"  value = "${result.data.balance}"  disabled="disabled" required>
                        </div>
                        <div class="line">
                            <label for="amount">Amount:</label>
                            <input type="number" id="amount" name="amount"required>
                        </div>
                          <button type="submit" id="update-btn">Recharge</button>
                      </form>
                    
                  </div>
                </div>
              </div>         
        </div>
    </main>`)}
  });
  $(document).on("click","#update-btn", function (e) {
    e.preventDefault();
    const resultdata = {
        amount: +document.getElementById("amount").value,
    };
      postData(`http://localhost:3000/api/v1/user/recharge/${id}`, resultdata).then(
        (result) => {
            if (!result.success) {
                alert(result.message);
            }else{
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