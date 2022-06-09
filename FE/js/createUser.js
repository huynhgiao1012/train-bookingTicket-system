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
  $(document).on("click","#update-btn", function (e) {
    e.preventDefault();
    const resultdata = {
        email: document.getElementById("email").value,
        dob: document.getElementById("dob").value,
        name: document.getElementById("name").value,
        address: document.getElementById("address").value,
        phone: document.getElementById("phone").value,
        idCard: document.getElementById("idCard").value,
    };
      postData(`http://localhost:3000/api/v1/user/create`, resultdata).then(
        (result) => {
            if (!result.success) {
                alert(Object.values(result.message)[0]);

            }else{
                alert(result.message);
                window.location.replace("ManageUser.html");
            }
          
          }
        
      );
    });