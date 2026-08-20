app.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    set,
    get
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// ========================================
// Firebase
// ========================================

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


// ========================================
// عناصر الصفحة
// ========================================

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const createButton = document.getElementById("createAccount");
const message = document.getElementById("message");


// ========================================
// توليد رقم حساب
// ========================================

async function generateAccountNumber() {

    for (let i = 0; i < 10; i++) {

        const number = Math.floor(
            1000000 + Math.random() * 9000000
        ).toString();

        const snapshot = await get(
            ref(db, "accountNumbers/" + number)
        );

        if (!snapshot.exists()) {
            return number;
        }
    }

    throw new Error(
        "تعذر توليد رقم حساب جديد."
    );
}


// ========================================
// فتح الحساب
// ========================================

createButton.addEventListener(
    "click",
    async () => {

        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;


        // ================================
        // التحقق
        // ================================

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


        // ================================
        // بدء العملية
        // ================================

        createButton.disabled = true;

        createButton.textContent =
            "جاري إنشاء الحساب...";

        message.innerHTML =
            "جاري الاتصال بـ Firebase...";


        try {

            // ============================
            // إنشاء رقم الحساب
            // ============================

            const accountNumber =
                await generateAccountNumber();


            // ============================
            // بريد داخلي فريد
            // ============================

            const email =
                accountNumber +
                "@bok-ped.firebaseapp.com";


            message.innerHTML =
                "جاري إنشاء الحساب...";


            // ============================
            // Firebase Authentication
            // ============================

            const credential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const uid =
                credential.user.uid;


            // ============================
            // حفظ المستخدم
            // ============================

            await set(
                ref(
                    db,
                    "users/" + uid
                ),
                {
                    username: username,
                    accountNumber: accountNumber
                }
            );


            // ============================
            // حفظ رقم الحساب
            // ============================

            await set(
                ref(
                    db,
                    "accountNumbers/" +
                    accountNumber
                ),
                {
                    uid: uid
                }
            );


            // ============================
            // النجاح
            // ============================

            message.innerHTML = `

                <div>
                    🎉 تم إنشاء الحساب بنجاح
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

                <br><br>

                <div>
                    كلمة المرور
                </div>

                <strong>
                    ${password}
                </strong>

                <p style="margin-top:15px;">
                    احتفظ ببيانات حسابك.
                </p>

            `;


            usernameInput.value = "";
            passwordInput.value = "";


        } catch (error) {

            console.error(error);

            let text =
                error.message ||
                "حدث خطأ غير معروف";


            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                text =
                    "رقم الحساب موجود بالفعل، حاول مرة أخرى.";

            }

            else if (
                error.code ===
                "auth/operation-not-allowed"
            ) {

                text =
                    "يجب تفعيل تسجيل الدخول باستخدام Email/Password من Firebase Authentication.";

            }

            else if (
                error.code ===
                "auth/invalid-credential"
            ) {

                text =
                    "بيانات Firebase غير صحيحة.";

            }

            else if (
                error.code ===
                "auth/network-request-failed"
            ) {

                text =
                    "تحقق من اتصال الإنترنت.";

            }

            else if (
                error.code ===
                "PERMISSION_DENIED"
            ) {

                text =
                    "Firebase Realtime Database يمنع حفظ البيانات. راجع Rules.";

            }


            message.innerHTML =
                "❌ فشل إنشاء الحساب" +
                "<br><br>" +
                text;

        }


        createButton.disabled = false;

        createButton.textContent =
            "فتح الحساب";

    }
);
