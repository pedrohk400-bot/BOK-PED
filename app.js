import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    get,
    set
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


/*
==================================================
FIREBASE
==================================================
*/

const firebaseConfig = {

    apiKey:
        "AIzaSyDnvmRTgZl1p325V3TmCjIH-PnPfjJPPpk",

    authDomain:
        "bok-ped.firebaseapp.com",

    projectId:
        "bok-ped",

    storageBucket:
        "bok-ped.firebasestorage.app",

    messagingSenderId:
        "812838230843",

    appId:
        "1:812838230843:web:f3bd5f59343db42b52b51e",

    measurementId:
        "G-26SMZR0QCC"

};


const ADMIN_UID =
    "zuwXPgS4TPYF5GyAYEPEOrsYV0z1";

const ADMIN_EMAIL =
    "website-reader@bok-ped.com";


const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getDatabase(app);


/*
==================================================
CUSTOMER AUTH
==================================================
*/

const customerApp =
    initializeApp(
        firebaseConfig,
        "CustomerCreationApp"
    );

const customerAuth =
    getAuth(customerApp);


/*
==================================================
ELEMENTS
==================================================
*/

const loginSection =
    document.getElementById("loginSection");

const accountSection =
    document.getElementById("accountSection");

const adminEmail =
    document.getElementById("adminEmail");

const adminPassword =
    document.getElementById("adminPassword");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");

const username =
    document.getElementById("username");

const password =
    document.getElementById("password");

const subscription =
    document.getElementById("subscription");

const subscriptionInfo =
    document.getElementById("subscriptionInfo");

const createAccount =
    document.getElementById("createAccount");

const message =
    document.getElementById("message");

const logoutButton =
    document.getElementById("logoutButton");


/*
==================================================
ESCAPE HTML
==================================================
*/

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/*
==================================================
LOGIN MESSAGE
==================================================
*/

function loginMsg(text, type) {

    loginMessage.textContent =
        text;

    loginMessage.style.display =
        "block";

    loginMessage.className =
        "message " + type;
}


/*
==================================================
ACCOUNT MESSAGE
==================================================
*/

function accountMsg(text, type) {

    message.innerHTML =
        escapeHTML(text)
        .replace(/\n/g, "<br>");

    message.style.display =
        "block";

    message.className =
        "message " + type;
}


/*
==================================================
SUBSCRIPTION
==================================================
*/

const subscriptionNames = {

    day:
        "يوم واحد",

    week:
        "أسبوع واحد",

    month:
        "شهر واحد",

    "3months":
        "3 شهور",

    "12months":
        "12 شهر"

};


function getDays(type) {

    if (type === "day")
        return 1;

    if (type === "week")
        return 7;

    if (type === "month")
        return 30;

    if (type === "3months")
        return 90;

    if (type === "12months")
        return 365;

    return 1;
}


function updateSubscriptionInfo() {

    const type =
        subscription.value;

    const days =
        getDays(type);

    subscriptionInfo.textContent =
        "مدة الاشتراك: " +
        subscriptionNames[type] +
        " (" +
        days +
        " يوم)";
}


subscription.addEventListener(
    "change",
    updateSubscriptionInfo
);

updateSubscriptionInfo();


/*
==================================================
GENERATE ACCOUNT NUMBER
==================================================
*/

function generateAccountNumber() {

    return String(
        Math.floor(
            1000000 +
            Math.random() * 9000000
        )
    );

}


/*
==================================================
FORMAT DATE
==================================================
*/

function formatDate(timestamp) {

    return new Intl.DateTimeFormat(
        "ar",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    ).format(
        new Date(timestamp)
    );

}


/*
==================================================
COPY TEXT
==================================================
*/

async function copyText(text, button) {

    try {

        await navigator.clipboard.writeText(
            text
        );

        const oldText =
            button.textContent;

        button.textContent =
            "تم النسخ ✓";

        setTimeout(
            function () {

                button.textContent =
                    oldText;

            },
            1500
        );

    } catch (error) {

        const input =
            document.createElement("textarea");

        input.value =
            text;

        document.body.appendChild(
            input
        );

        input.select();

        document.execCommand(
            "copy"
        );

        input.remove();

        const oldText =
            button.textContent;

        button.textContent =
            "تم النسخ ✓";

        setTimeout(
            function () {

                button.textContent =
                    oldText;

            },
            1500
        );

    }

}


/*
==================================================
LOGIN
==================================================
*/

loginButton.addEventListener(
    "click",
    async function () {

        const email =
            adminEmail.value.trim();

        const pass =
            adminPassword.value;


        if (!email) {

            loginMsg(
                "أدخل البريد الإلكتروني.",
                "error"
            );

            return;
        }


        if (!pass) {

            loginMsg(
                "أدخل كلمة المرور.",
                "error"
            );

            return;
        }


        loginButton.disabled =
            true;

        loginButton.textContent =
            "جاري الدخول...";


        try {

            const result =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    pass
                );


            const user =
                result.user;


            if (
                user.uid !== ADMIN_UID ||
                user.email !== ADMIN_EMAIL
            ) {

                await signOut(auth);

                loginMsg(
                    "هذا الحساب غير مصرح له بالدخول.",
                    "error"
                );

                return;
            }


            loginMsg(
                "تم تسجيل الدخول.",
                "success"
            );


            loginSection.style.display =
                "none";

            accountSection.style.display =
                "block";


        } catch (error) {

            console.error(error);


            let text =
                "فشل تسجيل الدخول.";


            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                text =
                    "البريد الإلكتروني أو كلمة المرور غير صحيحة.";

            } else if (
                error.code ===
                "auth/invalid-email"
            ) {

                text =
                    "البريد الإلكتروني غير صحيح.";

            } else if (
                error.code ===
                "auth/user-not-found"
            ) {

                text =
                    "الحساب غير موجود.";

            } else if (
                error.code ===
                "auth/wrong-password"
            ) {

                text =
                    "كلمة المرور غير صحيحة.";

            } else if (
                error.code ===
                "auth/network-request-failed"
            ) {

                text =
                    "تحقق من الإنترنت.";

            }


            loginMsg(
                text,
                "error"
            );


        } finally {

            loginButton.disabled =
                false;

            loginButton.textContent =
                "تسجيل الدخول";

        }

    }
);


/*
==================================================
CHECK SESSION
==================================================
*/

onAuthStateChanged(
    auth,
    function (user) {

        if (
            user &&
            user.uid === ADMIN_UID &&
            user.email === ADMIN_EMAIL
        ) {

            loginSection.style.display =
                "none";

            accountSection.style.display =
                "block";

        } else {

            loginSection.style.display =
                "block";

            accountSection.style.display =
                "none";

        }

    }
);


/*
==================================================
CREATE ACCOUNT
==================================================
*/

createAccount.addEventListener(
    "click",
    async function () {

        const admin =
            auth.currentUser;


        if (
            !admin ||
            admin.uid !== ADMIN_UID ||
            admin.email !== ADMIN_EMAIL
        ) {

            accountMsg(
                "يجب تسجيل الدخول بالحساب الإداري.",
                "error"
            );

            return;
        }


        const name =
            username.value.trim();

        const customerPassword =
            password.value;

        const type =
            subscription.value;


        if (!name) {

            accountMsg(
                "أدخل اسم العميل.",
                "error"
            );

            return;
        }


        if (
            customerPassword.length < 6
        ) {

            accountMsg(
                "كلمة المرور يجب أن تكون 6 أحرف على الأقل.",
                "error"
            );

            return;
        }


        createAccount.disabled =
            true;

        createAccount.textContent =
            "جاري فتح الحساب...";


        try {

            /*
            ==========================================
            FIND FREE ACCOUNT NUMBER
            ==========================================
            */

            let accountNumber;

            let exists = true;


            while (exists) {

                accountNumber =
                    generateAccountNumber();


                const accountRef =
                    ref(
                        db,
                        "accountNumbers/" +
                        accountNumber
                    );


                const snapshot =
                    await get(accountRef);


                exists =
                    snapshot.exists();

            }


            /*
            ==========================================
            CUSTOMER EMAIL
            ==========================================
            */

            const email =
                accountNumber +
                "@bok-ped.firebaseapp.com";


            /*
            ==========================================
            CREATE FIREBASE CUSTOMER
            ==========================================
            */

            const customerResult =
                await createUserWithEmailAndPassword(
                    customerAuth,
                    email,
                    customerPassword
                );


            const uid =
                customerResult.user.uid;


            /*
            ==========================================
            DATES
            ==========================================
            */

            const now =
                Date.now();


            const end =
                now +
                (
                    getDays(type) *
                    24 *
                    60 *
                    60 *
                    1000
                );


            /*
            ==========================================
            USER DATA
            ==========================================
            */

            const userData = {

                username:
                    name,

                accountNumber:
                    accountNumber,

                uid:
                    uid,

                createdAt:
                    now,

                subscriptionType:
                    type,

                subscriptionName:
                    subscriptionNames[type],

                subscriptionStart:
                    now,

                subscriptionEnd:
                    end,

                active:
                    true

            };


            /*
            ==========================================
            SAVE USER
            ==========================================
            */

            await set(
                ref(
                    db,
                    "users/" + uid
                ),
                userData
            );


            /*
            ==========================================
            SAVE ACCOUNT NUMBER
            ==========================================
            */

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


            /*
            ==========================================
            SIGN OUT CUSTOMER
            ==========================================
            */

            await signOut(
                customerAuth
            );


            /*
            ==========================================
            SUCCESS SCREEN
            ==========================================
            */

            const safeName =
                escapeHTML(name);

            const safeAccount =
                escapeHTML(accountNumber);

            const safePassword =
                escapeHTML(customerPassword);

            const safeSubscription =
                escapeHTML(
                    subscriptionNames[type]
                );

            const safeEnd =
                escapeHTML(
                    formatDate(end)
                );


            message.innerHTML = `

                <div class="account-box">

                    <div class="success-icon">
                        ✓
                    </div>

                    <span class="success-title">
                        تم إنشاء الحساب بنجاح 🎉
                    </span>


                    <div class="account-label">
                        اسم المستخدم
                    </div>

                    <strong>
                        ${safeName}
                    </strong>


                    <div class="account-label">
                        رقم الحساب
                    </div>

                    <div
                        class="account-number"
                        id="createdAccountNumber"
                    >
                        ${safeAccount}
                    </div>

                    <button
                        type="button"
                        class="account-copy"
                        id="copyAccountButton"
                    >
                        نسخ رقم الحساب
                    </button>


                    <div class="account-label">
                        كلمة المرور
                    </div>

                    <div
                        class="account-password"
                        id="createdPassword"
                    >
                        ${safePassword}
                    </div>

                    <button
                        type="button"
                        class="password-copy"
                        id="copyPasswordButton"
                    >
                        نسخ كلمة المرور
                    </button>


                    <div class="account-label">
                        مدة الاشتراك
                    </div>

                    <strong>
                        ${safeSubscription}
                    </strong>


                    <div class="account-label">
                        ينتهي الاشتراك في
                    </div>

                    <strong>
                        ${safeEnd}
                    </strong>


                    <div class="success-text">
                        احتفظ برقم الحساب وكلمة المرور.
                    </div>

                </div>

            `;


            message.style.display =
                "block";

            message.className =
                "message success";


            /*
            ==========================================
            COPY ACCOUNT
            ==========================================
            */

            const copyAccountButton =
                document.getElementById(
                    "copyAccountButton"
                );


            copyAccountButton.addEventListener(
                "click",
                function () {

                    copyText(
                        accountNumber,
                        copyAccountButton
                    );

                }
            );


            /*
            ==========================================
            COPY PASSWORD
            ==========================================
            */

            const copyPasswordButton =
                document.getElementById(
                    "copyPasswordButton"
                );


            copyPasswordButton.addEventListener(
                "click",
                function () {

                    copyText(
                        customerPassword,
                        copyPasswordButton
                    );

                }
            );


            /*
            ==========================================
            CLEAR FORM
            ==========================================
            */

            username.value =
                "";

            password.value =
                "";


        } catch (error) {

            console.error(error);


            accountMsg(
                "حدث خطأ: " +
                error.message,
                "error"
            );

        } finally {

            createAccount.disabled =
                false;

            createAccount.textContent =
                "فتح الحساب";

        }

    }
);


/*
==================================================
LOGOUT
==================================================
*/

logoutButton.addEventListener(
    "click",
    async function () {

        await signOut(auth);

        accountSection.style.display =
            "none";

        loginSection.style.display =
            "block";

        adminPassword.value =
            "";

        message.innerHTML =
            "";

        message.style.display =
            "none";

    }
);
