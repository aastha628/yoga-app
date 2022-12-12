function findViewById(id) {
  return document.getElementById(id);
}

function logoutUser() {
  window.localStorage.removeItem("token");
  window.location.replace("/login");
}
function onPaymentClicked() {
  window.localStorage.setItem("cameFromUserHome", "true");
  window.location.href = "/payment";
}

function onSelectBatchClicked() {
  window.localStorage.setItem("cameFromUserHome", "true");
  window.location.href = "/batch";
}
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
function setupViews(user) {
  console.log(user);
  findViewById("name").innerText = user.name;
  findViewById("email").innerText = user.email;
  findViewById("gender").innerText = user.gender;

  const dueDate = new Date(user.due_date);
  findViewById("dueDate").innerText = `${dueDate.getDate()} ${monthNames[dueDate.getMonth()]}, ${dueDate.getFullYear()}`;

  if (user.curr_batch == null) {
    findViewById("liveClassHeading").style.textDecoration = "line-through";
    findViewById("liveClassText").innerText = "Batch Selection Required";
    findViewById("currentBatch").innerHTML = "<em>Batch not selected</em>";
  } else {
    findViewById("currentBatch").innerHTML = `${user.curr_batch.batch_name} (${user.curr_batch.timings})<br>- ${user.curr_batch.instructor_name}`
  }

  if (user.next_batch == null) {
    findViewById("nextBatch").innerHTML = "<em>Batch not selected</em>";
  } else {
    findViewById("nextBatch").innerHTML = `${user.next_batch.batch_name} (${user.next_batch.timings})<br>- ${user.next_batch.instructor_name}`
  }
}

function loadContent() {
  // loading data for screen
  fetch("/api/user", {
    method: "GET",
    headers: {
      token: window.localStorage.getItem("token")
    }
  })
    .then(res => {
      if (res.status == 403) {
        window.localStorage.removeItem("token");
        window.location.replace("/login");
      } else {
        res.json()
          .then(({ user }) => {
            if (res.status == 402) {
              findViewById("liveClassHeading").style.textDecoration = "line-through";
              findViewById("liveClassText").innerText = "Payment Required";
            }
            setupViews(user)
          })
          .catch(error => { throw error })
      }
    })
    .catch(error => {
      console.error(error);
      window.alert("something went wrong");
    })
}

window.onload = () => {
  if (window.localStorage.getItem("token") == null) {
    window.location.replace("/login")
  }
  loadContent();
}

window.onfocus = () => {
  if (window.localStorage.getItem("updated")) {
    window.localStorage.removeItem("updated");
    window.location.replace("/user-home");
  }
}
