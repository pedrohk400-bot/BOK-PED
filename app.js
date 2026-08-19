import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    set,
    get,
    child
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// ===============================
// Firebase Configuration
// ===============================

const firebaseConfig = {
    apiKey: "AIzaSyDnvmRTgZl1p325V3TmCjIH-PnPfjJPPpk",
    authDomain: "bok-ped.firebaseapp.com",
    projectId: "bok-ped",
    storageBucket: "bok-ped.firebasestorage.app",
    messagingSenderId: "812838230843",
    appId: "1:812838230843:web:f3bd5f59343db42b52b51e",
    measurementId: "G-26SMZR0QCC"
};


// ===============================
// Initialize Firebase
// ===============================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getDatabase(app);


// ===============================
// Elements
// ===============================

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmPasswordInput =
    document.getElementById("confirmPassword");

const createButton =
    document.getElementById("createAccount");

const message =
    document.getElementById("message");


// ===============================
// Generate 7 Digit Account Number
// ===============================

function generateAccountNumber() {

    return Math.floor(
        1000000 + Math.random() * 9000000
    ).toString();

}


// ===============================
// Check Account Number
// ===============================

async function accountNumberExists(accountNumber) {

    const snapshot = await get(
        child(
            ref(db),
            "accounts/" + accountNumber
        )
    );

    return snapshot.exists();

}


// ===============================
// Create Account
// ===============================

createButton.addEventListener("click", async () => {

    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;


    // ===========================
    // Validation
    // ===========================

    if (username.length < 3) {

        message.className = "error";

        message.textContent =
            "اسم المستخدم يجب أن يكون 3 أحرف على الأقل.";

        return;
    }


    if (password.length < 6) {

        message.className = "error";

        message.textContent =
            "كلمة المرور يجب أن تكون 6 أحرف أو أرقام على الأقل.";

        return;
    }


    if (password !== confirmPassword) {

        message.className = "error";

        message.textContent =
            "كلمتا المرور غير متطابقتين.";

        return;
    }


    createButton.disabled = true;

    message.className = "";

    message.textContent =
        "جاري إنشاء الحساب...";


    try {

        // ===========================
        // Generate unique account
        // ===========================

        let accountNumber;

        let exists = true;

        while (exists) {

            accountNumber =
                generateAccountNumber();

            exists =
                await accountNumberExists(
                    accountNumber
                );

        }


        // ===========================
        // Create Firebase Auth User
        // ===========================

        /*
         * Firebase Authentication يحتاج Email.
         * سننشئ Email داخليًا باستخدام رقم الحساب.
         */

        const internalEmail =
            accountNumber +
            "@bok-ped.firebaseapp.com";


        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                internalEmail,
                password
            );


        const uid =
            userCredential.user.uid;


        // ===========================
        // Save User Data
        // ===========================

        await set(
            ref(
                db,
                "accounts/" + accountNumber
            ),
            {

                username: username,

                accountNumber:
                    accountNumber,

                uid: uid

            }
        );


        // ===========================
        // Success
        // ===========================

        message.className =
            "success";

        message.innerHTML = `
            تم إنشاء الحساب بنجاح 🎉

            <div class="account-box">

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

                <div class="account-number">
                    ${accountNumber}
                </div>

                <p style="margin-top:15px;">
                    احتفظ برقم الحساب، ستحتاجه
                    لتسجيل الدخول من التطبيق.
                </p>

            </div>
        `;


        usernameInput.value = "";

        passwordInput.value = "";

        confirmPasswordInput.value = "";


    } catch (error) {

        console.error(error);


        message.className =
            "error";


        if (
            error.code ===
            "auth/email-already-in-use"
        ) {

            message.textContent =
                "حدث تعارض، حاول إنشاء الحساب مرة أخرى.";

        } else {

            message.textContent =
                "حدث خطأ أثناء إنشاء الحساب: " +
                error.message;

        }

    }


    createButton.disabled = false;

});
