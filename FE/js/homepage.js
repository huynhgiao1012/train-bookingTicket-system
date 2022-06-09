const loadHomepage = () => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const url = "http://localhost:3000/api/v1/auth/home";
  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
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
          <a href="ChangePassword.html">Change Password</a>
          <a class="logout" href="FirstPage.html">Logout</a>
        </div>
      </header>
      <div class="container">
        <div class="head">
          <span><a href="ViewTrip.html">View Trip</a></span>
          <span class="red"><a href="ViewTicket.html">View Ticket</a></span>
          <span><a href="BookTicket.html">Book Ticket</a></span>
          <span class="red"><a href="Payment.html">Pay Ticket</a></span>
          <span><a href="RechargeBalance.html">Recharge Balance</a></span>
          <span class="red"
            ><a href="UserDetail.html">View Personal Infomation</a></span
          >
        </div>
        <div class="content">
          <div class="left">
            <video autoplay loop muted width="100%" height="641px">
              <source src="./image/Welcome to Vietnam.mp4" />
            </video>
          </div>
          <div class="right">
            <h1>Welcome to TCAT company</h1>
            <h2>Travel to anywhere in VietNam</h2>
            <h3>Let's enjoy</h3>
          </div>
        </div>
        <div class="podes">
          <h2>Popular Destination</h2>
          <div class="list">
            <div class="pleft">
              <div class="item">
                <img src="./image/h1.png" alt="" />
                <div class="ct">
                  <h3>Ha Noi</h3>
                  <i class="fa-solid fa-arrow-right"></i>
                  <h3>Lao Cai</h3>
                </div>
              </div>
              <div class="item">
                <img src="./image/h2.png" alt="" />
                <div class="ct">
                  <h3>Ha Noi</h3>
                  <i class="fa-solid fa-arrow-right"></i>
                  <h3>Lao Cai</h3>
                </div>
              </div>
            </div>
            <div class="pright">
              <div class="item">
                <img src="./image/h3.png" alt="" />
                <div class="ct">
                  <h3>Ha Noi</h3>
                  <i class="fa-solid fa-arrow-right"></i>
                  <h3>Lao Cai</h3>
                </div>
              </div>
              <div class="item">
                <img src="./image/h4.png" alt="" />
                <div class="ct">
                  <h3>Ha Noi</h3>
                  <i class="fa-solid fa-arrow-right"></i>
                  <h3>Lao Cai</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div class="logo">
          <img src="./image/logo@2x.png" alt="" />
          <p>
            We are a young company always looking for new and creative ideas to
            help you with our products in your everyday work.
          </p>
          <a href="">Our Team</a>
        </div>
        <div class="contact">
          <h2>Contact</h2>
          <div>
            <span><i class="fa-solid fa-location-dot"></i></span>
            <p>Linh Trung, Thu Duc, Ho Chi Minh, VietNam</p>
          </div>
          <div>
            <span><i class="fa-solid fa-phone"></i></span>
            <p>+94 8106317</p>
          </div>
          <div>
            <span><i class="fa-solid fa-envelope"></i></span>
            <p>tcatcompany@gmail.com</p>
          </div>
          <div>
            <span><i class="fa-solid fa-comment"></i></span>
            <a href="">Feedback</a>
          </div>
        </div>
        <div class="fright">
          <h2>Link</h2>
          <div>
            <a href="">Home</a>
            <a href="">Features</a>
            <a href="">How it works</a>
            <a href="">Our clients</a>
          </div>
          <div class="info">
            <i class="fa-brands fa-facebook-f"></i>
            <i class="fa-brands fa-twitter"></i>
            <i class="fa-brands fa-linkedin-in"></i>
          </div>
        </div>
      </footer>
              `);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
$(document).on("click", ".logout", function (e) {
  e.preventDefault();
  window.localStorage.clear();
  window.location.replace("FirstPage.html");
});
loadHomepage();
