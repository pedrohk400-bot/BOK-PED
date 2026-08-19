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


const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const createButton =
    document.getElementById("createAccount");

const message =
    document.getElementById("message");


function generateAccountNumber() {

    return Math.floor(
        1000000 +
        Math.random() * 9000000
    ).toString();

}


function showMessage(text, type) {

    message.className = type;

    message.innerHTML = text;

}


createButton.addEventListener(
    "click",
    async function () {

        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;


        if (username.length < 3) {

            showMessage(
                "اسم المستخدم يجب أن يكون 3 أحرف على الأقل.",
                "error"
            );

            return;
        }


        if (password.length < 6) {

            showMessage(
                "كلمة المرور يجب أن تكون 6 أحرف على الأقل.",
                "error"
            );

            return;
        }


        if (password !== confirmPassword) {

            showMessage(
                "كلمتا المرور غير متطابقتين.",
                "error"
            );

            return;
        }


        createButton.disabled = true;

        createButton.textContent =
            "جاري إنشاء الحساب...";


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


            const uid =
                result.user.uid;


            await set(
                ref(
                    db,
                    "users/" + uid
                ),
                {
                    username:
                        username,

                    accountNumber:
                        accountNumber
                }
            );


            await set(
                ref(
                    db,
                    "accountNumbers/" +
                    accountNumber
                ),
                {
                    uid:
                        uid
                }
            );


            showMessage(

                "<div>تم إنشاء الحساب بنجاح 🎉</div>" +

                "<div class='account-box'>" +

                "<div>اسم المستخدم</div>" +

                "<strong>" +
                username +
                "</strong>" +

                "<br><br>" +

                "<div>رقم الحساب</div>" +

                "<div class='account-number'>" +
                accountNumber +
                "</div>" +

                "</div>" +

                "<p style='margin-top:15px'>" +
                "احتفظ برقم الحساب وكلمة المرور." +
                "</p>",

                "success"
            );


            usernameInput.value = "";

            passwordInput.value = "";

            confirmPasswordInput.value = "";


        } catch (error) {

            console.error(error);

            showMessage(

                "حدث خطأ:<br>" +
                error.code +
                "<br>" +
                error.message,

                "error"
            );

        }


        createButton.disabled = false;

        createButton.textContent =
            "فتح الحساب";

    }
);
