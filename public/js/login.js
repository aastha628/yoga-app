function findViewById(id) {
  return document.getElementById(id)
}
function onFormSubmit(e) {
  e.preventDefault()
  let email = findViewById("email").value.trim();
  let password = findViewById("password").value

  if (email == '') {
    window.alert("All fields are mandatory")
    return;
  }

  const data = { email, password }

  fetch('/api/user/login', {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify(data)
  }).then(res => {
    if (res.status == 200) {
      res.json().then(data => {
        window.localStorage.setItem("token", data.token);
        console.log(data)
        window.location.replace("/user-home")
      }).catch(err => { throw err })
    } else {
      window.alert("Authentication failed");
    }
  }).catch(err => {
    window.alert("Something went wrong!")
    console.error(err)
  });
}

window.onload = () => {
  if (window.localStorage.getItem("token")) {
    window.location.replace("/user-home");
  }
}