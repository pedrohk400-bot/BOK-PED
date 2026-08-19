const button = document.getElementById("createAccount");
const message = document.getElementById("message");

button.addEventListener("click", function () {
    message.textContent = "JavaScript يعمل ✅";
    message.className = "success";
});
