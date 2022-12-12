var cameFromUserHome = false;

function makePayment(){
    const data = {amount:500};
    fetch("/api/payment",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "token":window.localStorage.getItem("token")
        },
        body: JSON.stringify(data)
    }).then(res=>{
        if (res.status == 403) {
            window.localStorage.removeItem("token");
            window.location.replace("/login")
        } else if(res.status==200){
            if (cameFromUserHome) {
                window.localStorage.setItem("updated", "true");
                window.history.back();
              } else {
                window.location.replace("/user-home");
              }
        }
        else{
            throw new Error();
        }
    })
    .catch(error=>{
        console.error(error);
        window.alert("Something went wrong!!");
    })
}

window.onload = ()=>{
    if (window.localStorage.getItem("cameFromUserHome")) {
        cameFromUserHome = true;
        window.localStorage.removeItem("cameFromUserHome");
      }
}