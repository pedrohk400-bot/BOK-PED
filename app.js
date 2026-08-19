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


// ================================
// Firebase Configuration
// ================================

const firebaseConfig = {
    apiKey: "AIzaSyDnvmRTgZl1p325V3TmCjIH-PnPfjJPPpk",
    authDomain: "bok-ped.firebaseapp.com",
    projectId: "bok-ped",
    storageBucket: "bok-ped.firebasestorage.app",
    messagingSenderId: "812838230843",
    appId: "1:812838230843:web:f3bd5f59343db42b52b51e",
    measurementId: "G-26SMZR0QCC"
};


// ================================
// Firebase Start
// ================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getDatabase(app);


// ================================
// الصفحة
// ================================

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


// ================================
// التأكد أن Firebase اشتغل
// ================================

if (!createButton) {

    console.error(
        "زر إنشاء الحساب غير موجود في index.html"
    );

} else {

    createButton.addEventListener(
        "click",
        createAccount
    );

}


// ================================
// توليد رقم حساب 7 أرقام
// ================================

function generateAccountNumber() {

    return Math.floor(
        1000000 +
        Math.random() * 9000000
    ).toString();

}


// ================================
// إنشاء الحساب
// ================================

async function createAccount() {

    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;


    // ----------------------------
    // التحقق
    // ----------------------------

    if (username.length < 3) {

        showError(
            "اسم المستخدم يجب أن يكون 3 أحرف على الأقل."
        );

        return;
    }


    if (password.length < 6) {

        showError(
            "كلمة المرور يجب أن تكون 6 أحرف على الأقل."
        );

        return;
    }


    if (password !== confirmPassword) {

        showError(
            "كلمتا المرور غير متطابقتين."
        );

        return;
    }


    // ----------------------------
    // تحميل
    // ----------------------------

    createButton.disabled = true;

    createButton.textContent =
        "جاري إنشاء الحساب...";

    message.textContent = "";


    try {

        // ----------------------------
        // رقم الحساب
        // ----------------------------

        const accountNumber =
            generateAccountNumber();


        // ----------------------------
        // بريد داخلي لـ Firebase
        // ----------------------------

        const email =
            accountNumber +
            "@bok-ped.firebaseapp.com";


        // ----------------------------
        // إنشاء مستخدم Firebase
        // ----------------------------

        const result =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const uid =
            result.user.uid;


        // ----------------------------
        // حفظ بيانات المستخدم
        // ----------------------------

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


        // ----------------------------
        // حفظ رقم الحساب
        // ----------------------------

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


        // ----------------------------
        // نجاح
        // ----------------------------

        message.className =
            "success";

        message.innerHTML =

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

            "<p style='margin-top:15px;'>" +
            "احتفظ برقم الحساب وكلمة المرور." +
            "</p>";


        usernameInput.value = "";

        passwordInput.value = "";

        confirmPasswordInput.value = "";


    } catch (error) {

        console.error(
            "Firebase Error:",
            error
        );


        showError(
            "خطأ: " +
            error.code +
            "<br>" +
            error.message
        );

    }


    createButton.disabled = false;

    createButton.textContent =
        "فتح الحساب";

}


// ================================
// عرض الخطأ
// ================================

function showError(text) {

    message.className =
        "error";

    message.innerHTML =
        text;

        }        const password =
            passwordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;


        // -------------------------------
        // التحقق من اسم المستخدم
        // -------------------------------

        if (username.length < 3) {

            message.className = "error";

            message.textContent =
                "اسم المستخدم يجب أن يكون 3 أحرف على الأقل.";

            return;
        }


        // -------------------------------
        // التحقق من كلمة المرور
        // -------------------------------

        if (password.length < 6) {

            message.className = "error";

            message.textContent =
                "كلمة المرور يجب أن تكون 6 أحرف أو أرقام على الأقل.";

            return;
        }


        // -------------------------------
        // تأكيد كلمة المرور
        // -------------------------------

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

            // -------------------------------
            // توليد رقم الحساب
            // -------------------------------

            const accountNumber =
                await generateUniqueAccountNumber();


            // -------------------------------
            // Firebase Authentication
            // -------------------------------

            /*
             * نستخدم بريدًا داخليًا مبنيًا
             * على رقم الحساب.
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


            // -------------------------------
            // حفظ بيانات المستخدم
            // -------------------------------

            await set(
                ref(
                    db,
                    "users/" + uid
                ),
                {
                    username: username,

                    accountNumber:
                        accountNumber
                }
            );


            // -------------------------------
            // حفظ رقم الحساب كرقم مستخدم
            // -------------------------------

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


            // -------------------------------
            // نجاح
            // -------------------------------

            message.className =
                "success";

            message.innerHTML = `
                
                <div>
                    تم إنشاء الحساب بنجاح 🎉
                </div>

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

                </div>

                <p style="margin-top:15px;">
                    احتفظ برقم الحساب وكلمة المرور
                    لتسجيل الدخول من التطبيق.
                </p>

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
                    "حدث تعارض أثناء إنشاء الحساب، حاول مرة أخرى.";

            }

            else if (
                error.code ===
                "auth/invalid-email"
            ) {

                message.textContent =
                    "حدث خطأ في بيانات الحساب.";

            }

            else if (
                error.code ===
                "auth/weak-password"
            ) {

                message.textContent =
                    "كلمة المرور ضعيفة.";

            }

            else {

                message.textContent =
                    "حدث خطأ أثناء إنشاء الحساب.";

                console.error(
                    error.message
                );
            }

        }


        createButton.disabled = false;

    }
);
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
