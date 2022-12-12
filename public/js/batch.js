var cameFromUserHome = false;

function findViewById(id) {
  return document.getElementById(id)
}

function showBatches() {
  fetch("/api/batch", { method: "GET" })
    .then(res => {
      if (res.status != 200) {
        throw new Error();
      }
      res.json()
        .then(({ data }) => {
          // adding batch container
          const batchContainers = data.map(item => {
            const container = document.createElement("div");
            container.className = "batch-container";

            const titleBlock = document.createElement("h3")
            titleBlock.innerText = item.title

            const batchDetail = document.createElement("div")
            batchDetail.className = "batch-details"
            batchDetail.innerHTML = `<p class="caption">${item.description}</p><table><tr><td class="table-field">Timings (24-hours)</td><td class="table-value">${item.timings}</td></tr><tr><td class="table-field">Instructor</td><td class="table-value">${item.instructorName}</td></tr></table>`;

            container.appendChild(titleBlock);
            container.appendChild(batchDetail);

            return container;
          })

          batchContainers.forEach(item => findViewById("batches-grid").appendChild(item));

          // allowing users to select batches
          if (window.localStorage.getItem("token") == null) {
            findViewById("select-batch").style.display = "none";
          } else {
            findViewById("select-batch").style.display = "block";
            data.forEach(item => {
              const optionContainer = document.createElement("option");
              optionContainer.value = item.id;
              optionContainer.innerText = `${item.title} (Timing: ${item.timings})`;
              findViewById("batch").appendChild(optionContainer);
            })
          }
        })
        .catch(error => { throw error; });
    })
    .catch(error => {
      console.error(error);
      window.alert("something went wrong!");
    })
}

function changeBatch() {
  const data = { batch_id: findViewById("batch").value }
  fetch("/api/user/", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "token": window.localStorage.getItem("token")
    },
    body: JSON.stringify(data)
  })
    .then(res => {
      if (res.status == 200) {
        if (cameFromUserHome) {
          window.localStorage.setItem("updated", "true");
          window.history.back();
        } else {
          window.location.replace("/user-home");
        }
      } else {
        throw new Error();
      }
    })
    .catch(error => {
      console.error(error);
      window.alert("something went wrong");
    })
}

window.onload = () => {
  if (window.localStorage.getItem("cameFromUserHome")) {
    cameFromUserHome = true;
    window.localStorage.removeItem("cameFromUserHome");
  }
  showBatches();
}
