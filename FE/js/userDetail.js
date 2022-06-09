const loadUserDetailpage = () => {
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
      if (!result.success) {
        $("body").append(`
                    <h1>Errror</h1>
                `);
      } else {
        $('#fullname').html(result.data.name)
        $('#dob').html(result.data.dob.slice(0,-14))
        $("#address").html(result.data.address)
        $("#phone").html(result.data.phone)
        $("#email").html(result.data.email)
        $("#idCard").html(result.data.idCard)

      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
loadUserDetailpage();
