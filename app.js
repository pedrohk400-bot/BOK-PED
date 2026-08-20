app.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    set
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyDnvmRTgZl1p325V3TmCjIH-PnPfjJPPpk",
    authDomain: "bok-ped.firebaseapp.com",
    projectId: "bok-ped",
    storageBucket: "bok-ped.firebasestorage.app",
    messagingSenderId: "812838230843",
    appId: "1:812838230843:web:f3bd5f59343db42b52b51e",
    measurementId: "G-26SMZR0QCC"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);


const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const createButton = document.getElementById("createAccount");
const message = document.getElementById("message");


function generateAccountNumber() {
    return Math.floor(
        1000000 + Math.random() * 9000000
    ).toString();
}


createButton.addEventListener("click", async () => {

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();


    if (username.length < 3) {
        message.innerHTML =
            "❌ اسم المستخدم يجب أن يكون 3 أحرف على الأقل.";
        return;
    }


    if (password.length < 6) {
        message.innerHTML =
            "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل.";
        return;
    }


    createButton.disabled = true;
    createButton.textContent = "جاري إنشاء الحساب...";
    message.innerHTML = "انتظر...";


    try {

        const accountNumber =
            generateAccountNumber();


        const email =
            accountNumber +
            "@bok-ped.firebaseapp.com";


        const result =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const uid = result.user.uid;


        await set(
            ref(db, "users/" + uid),
            {
                username: username,
                accountNumber: accountNumber
            }
        );


        await set(
            ref(db, "accountNumbers/" + accountNumber),
            {
                uid: uid
            }
        );


        message.innerHTML = `
            <div>
                ✅ تم إنشاء الحساب بنجاح
            </div>

            <br>

            <div>
                اسم المستخدم
            </div>

            <strong>
                ${username}
            </strong>

            <br><br>

            <div>
                رقم الحساب
            </div>

            <strong>
                ${accountNumber}
            </strong>
        `;


        usernameInput.value = "";
        passwordInput.value = "";


    } catch (error) {

        console.error(error);

        message.innerHTML =
            "❌ حدث خطأ<br><br>" +
            (error.code || "") +
            "<br>" +
            error.message;

    }


    createButton.disabled = false;
    createButton.textContent = "فتح الحساب";

});
