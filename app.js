const message = document.getElementById("message");
const button = document.getElementById("createAccount");

if (button) {
    button.addEventListener("click", function () {
        message.className = "success";
        message.textContent = "JavaScript يعمل ✅";
    });
}
