window.onload = () => {
    if (window.localStorage.getItem("token")) {
        window.location.replace("/user-home");
    }
}