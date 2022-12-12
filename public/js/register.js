function findViewById(id) {
  return document.getElementById(id)
}
function onFormSubmit(e) {
  e.preventDefault()
  let name = findViewById("name").value.trim()
  let email = findViewById("email").value.trim()
  let password = findViewById("password").value
  let age = parseInt(findViewById("age").value)
  let gender = findViewById("gender").value

  if (name == '' || email == '' || password == '') {
    window.alert("All fields are mandatory.")
    return;
  }

  const user = { name, email, password, age, gender }
  console.log(user);

  fetch('/api/user/register', {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify(user)
  }).then(res => {
    res.json().then(data => {
      if (res.status == 201) {
        window.location.replace("/login")
      }
      else {
        window.alert(data.error.message);
      }
    }).catch(err => {
      throw err;
    })
  }).catch(err => { console.error(err) });
}

window.onload = () => {
  if (window.localStorage.getItem("token")) {
    window.location.replace("/user-home");
  }
}
