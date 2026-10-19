<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#080b14">
<title>BOK PEDRO - لوحة الإدارة</title>

<style>
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    background: #080b14;
    color: #f4f7ff;
    font-family: Arial, sans-serif;
    padding: 20px;
}

.container {
    width: 100%;
    max-width: 480px;
    margin: 35px auto;
}

.header {
    text-align: center;
    margin-bottom: 25px;
}

.logo {
    width: 70px;
    height: 70px;
    margin: auto;
    border-radius: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #168bff, #00c8ff);
    color: white;
    font-size: 27px;
    font-weight: bold;
    box-shadow: 0 8px 35px #168bff40;
}

h1 {
    font-size: 25px;
    margin-bottom: 8px;
}

.subtitle {
    color: #98a6c2;
    line-height: 1.8;
    font-size: 14px;
}

.card {
    background: #111827;
    border: 1px solid #253047;
    border-radius: 22px;
    padding: 22px;
    margin-bottom: 18px;
    box-shadow: 0 15px 45px #00000025;
}

.card h2 {
    font-size: 20px;
    margin: 0 0 20px;
}

label {
    display: block;
    margin: 15px 0 8px;
    color: #c5d0e5;
    font-size: 14px;
}

input, select {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: 1px solid #303c54;
    background: #090e19;
    color: white;
    font-size: 15px;
    outline: none;
}

input:focus, select:focus {
    border-color: #168bff;
}

button {
    width: 100%;
    padding: 14px;
    margin-top: 16px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #168bff, #00a9e8);
    color: white;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
}

button:disabled {
    opacity: 0.6;
    cursor: wait;
}

.secondary {
    background: #202b40;
}

.message {
    display: none;
    margin-top: 16px;
    padding: 13px;
    border-radius: 12px;
    line-height: 1.8;
    overflow-wrap: anywhere;
    font-size: 14px;
}

.error {
    display: block;
    background: #401923;
    color: #ffb8c3;
    border: 1px solid #783444;
}

.success {
    display: block;
    background: #102c28;
    color: #b5ffdc;
    border: 1px solid #236a53;
}

.info {
    margin-top: 10px;
    color: #9cb4d8;
    font-size: 13px;
    line-height: 1.8;
}

.account-box {
    margin-top: 8px;
    padding: 18px;
    background: #0b1422;
    border: 1px solid #24415f;
    border-radius: 16px;
    text-align: center;
}

.success-icon {
    width: 52px;
    height: 52px;
    margin: 0 auto 12px;
    border-radius: 50%;
    background: #145c43;
    color: #83ffc6;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 27px;
}

.success-title {
    display: block;
    font-size: 18px;
    margin-bottom: 20px;
}

.account-label {
    color: #9db2d0;
    margin-top: 18px;
    margin-bottom: 8px;
    font-size: 13px;
}

.account-number, .account-password {
    padding: 13px;
    border-radius: 10px;
    background: #172338;
    color: #ffffff;
    overflow-wrap: anywhere;
    font-size: 19px;
    font-weight: bold;
    direction: ltr;
}

.account-copy, .password-copy {
    margin-top: 8px;
    padding: 11px;
    background: #243651;
}

.success-text {
    margin-top: 20px;
    color: #8fffc9;
    font-size: 13px;
    line-height: 1.8;
}

.footer {
    text-align: center;
    color: #67758e;
    font-size: 12px;
    padding: 20px 0;
}

#accountSection {
    display: none;
}

</style>
</head>

<body>

<div class="container">

    <div class="header">
        <div class="logo">B</div>
        <h1>BOK PEDRO</h1>
        <div class="subtitle">
            لوحة إدارة الحسابات والاشتراكات
        </div>
    </div>

    <!-- تسجيل دخول المدير -->

    <section class="card" id="loginSection">

        <h2>تسجيل دخول المدير</h2>

        <div class="subtitle">
            سجّل الدخول باستخدام البريد الإلكتروني وكلمة المرور المرتبطين بحساب المدير في Firebase.
        </div>

        <label for="adminEmail">البريد الإلكتروني</label>

        <input
            type="email"
            id="adminEmail"
            value="website-reader@bok-ped.com"
            autocomplete="username"
            placeholder="البريد الإلكتروني">

        <label for="adminPassword">كلمة المرور</label>

        <input
            type="password"
            id="adminPassword"
            autocomplete="current-password"
            placeholder="كلمة المرور">

        <button id="loginButton" type="button">
            تسجيل الدخول
        </button>

        <div id="loginMessage" class="message"></div>

    </section>


    <!-- لوحة إنشاء الحسابات -->

    <section class="card" id="accountSection">

        <h2>إنشاء حساب عميل</h2>

        <label for="username">اسم العميل</label>

        <input
            type="text"
            id="username"
            maxlength="120"
            placeholder="أدخل اسم العميل">

        <label for="password">كلمة مرور العميل</label>

        <input
            type="password"
            id="password"
            autocomplete="new-password"
            placeholder="أدخل كلمة المرور">

        <label for="subscription">مدة الاشتراك</label>

        <select id="subscription">

            <option value="day">يوم واحد</option>

            <option value="week">أسبوع واحد</option>

            <option value="month" selected>
                شهر واحد
            </option>

            <option value="3months">
                3 شهور
            </option>

            <option value="12months">
                12 شهر
            </option>

        </select>

        <div id="subscriptionInfo" class="info"></div>

        <button id="createAccount" type="button">
            فتح الحساب
        </button>

        <div id="message" class="message"></div>

        <button
            id="logoutButton"
            class="secondary"
            type="button">
            تسجيل الخروج
        </button>

    </section>

    <div class="footer">
        BOK PEDRO · لوحة الإدارة
    </div>

</div>


<script type="module">

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


/* =========================================
   FIREBASE - المشروع الجديد
========================================= */

const firebaseConfig = {
    apiKey: "AIzaSyCRUpWEIvw927UEIjdl_G7ecdgZ_V-oDpo",
    authDomain: "bok-pedro-new.firebaseapp.com",
    databaseURL: "https://bok-pedro-new-default-rtdb.firebaseio.com",
    projectId: "bok-pedro-new",
    storageBucket: "bok-pedro-new.firebasestorage.app",
    messagingSenderId: "79997674431",
    appId: "1:79997674431:web:92c4b0db8d8d5d3863370a",
    measurementId: "G-HJ3PYMKG5X"
};

const ADMIN_UID = "gL1GGUJ7FWS4zRZmzdaf60qqHMD3";

const ADMIN_EMAIL = "website-reader@bok-ped.com";

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getDatabase(app);


/*
 * تطبيق مصادقة منفصل لإنشاء حسابات العملاء.
 * هذا يحافظ على جلسة دخول المدير.
 */

const customerApp = initializeApp(
    firebaseConfig,
    "CustomerCreationApp"
);

const customerAuth = getAuth(customerApp);


/* =========================================
   ELEMENTS
========================================= */

const loginSection = document.getElementById("loginSection");
const accountSection = document.getElementById("accountSection");

const adminEmail = document.getElementById("adminEmail");
const adminPassword = document.getElementById("adminPassword");

const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

const username = document.getElementById("username");
const password = document.getElementById("password");

const subscription = document.getElementById("subscription");
const subscriptionInfo = document.getElementById("subscriptionInfo");

const createAccount = document.getElementById("createAccount");
const message = document.getElementById("message");

const logoutButton = document.getElementById("logoutButton");


/* =========================================
   MESSAGES
========================================= */

function loginMsg(text, type) {
    loginMessage.textContent = text;
    loginMessage.className = "message " + type;
    loginMessage.style.display = "block";
}

function accountMsg(text, type) {
    message.textContent = text;
    message.className = "message " + type;
    message.style.display = "block";
}


/* =========================================
   SUBSCRIPTIONS
========================================= */

const subscriptionNames = {
    day: "يوم واحد",
    week: "أسبوع واحد",
    month: "شهر واحد",
    "3months": "3 شهور",
    "12months": "12 شهر"
};

function getDays(type) {
    if (type === "day") return 1;
    if (type === "week") return 7;
    if (type === "month") return 30;
    if (type === "3months") return 90;
    if (type === "12months") return 365;
    return 30;
}

function updateSubscriptionInfo() {
    const type = subscription.value;
    const days = getDays(type);

    subscriptionInfo.textContent =
        "مدة الاشتراك: " +
        subscriptionNames[type] +
        " (" + days + " يوم)";
}

subscription.addEventListener(
    "change",
    updateSubscriptionInfo
);

updateSubscriptionInfo();


/* =========================================
   ACCOUNT NUMBER
========================================= */

function generateAccountNumber() {
    return String(
        Math.floor(1000000 + Math.random() * 9000000)
    );
}


/*
 * نحدد عدداً أقصى للمحاولات حتى لا يستمر
 * البرنامج في البحث إلى ما لا نهاية.
 */

async function findAvailableAccountNumber() {
    for (let i = 0; i < 30; i++) {
        const number = generateAccountNumber();

        const snapshot = await get(
            ref(db, "accountNumbers/" + number)
        );

        if (!snapshot.exists()) {
            return number;
        }
    }

    throw new Error(
        "تعذر إيجاد رقم حساب متاح. حاول مرة أخرى."
    );
}


/* =========================================
   DATE
========================================= */

function formatDate(timestamp) {
    return new Intl.DateTimeFormat("ar", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(timestamp));
}


/* =========================================
   COPY
========================================= */

async function copyText(text, button) {
    const oldText = button.textContent;

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            const input = document.createElement("textarea");
            input.value = text;
            input.style.position = "fixed";
            input.style.opacity = "0";

            document.body.appendChild(input);
            input.focus();
            input.select();

            const copied = document.execCommand("copy");

            input.remove();

            if (!copied) {
                throw new Error("copy failed");
            }
        }

        button.textContent = "تم النسخ ✓";

        setTimeout(function() {
            button.textContent = oldText;
        }, 1500);

    } catch (error) {
        accountMsg(
            "تعذر النسخ تلقائياً. اضغط مطولاً على البيانات لنسخها.",
            "error"
        );
    }
}


/* =========================================
   ADMIN LOGIN
========================================= */

loginButton.addEventListener("click", async function() {
    const email = adminEmail.value.trim();
    const pass = adminPassword.value;

    if (!email) {
        loginMsg("أدخل البريد الإلكتروني.", "error");
        return;
    }

    if (!pass) {
        loginMsg("أدخل كلمة المرور.", "error");
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "جاري الدخول...";

    try {
        const result = await signInWithEmailAndPassword(
            auth,
            email,
            pass
        );

        const user = result.user;

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

        loginMsg("تم تسجيل الدخول بنجاح.", "success");

        loginSection.style.display = "none";
        accountSection.style.display = "block";

    } catch (error) {
        console.error("Login error:", error);

        let text = "فشل تسجيل الدخول.";

        if (
            error.code === "auth/invalid-credential" ||
            error.code === "auth/wrong-password" ||
            error.code === "auth/user-not-found"
        ) {
            text = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
        } else if (error.code === "auth/invalid-email") {
            text = "البريد الإلكتروني غير صحيح.";
        } else if (
            error.code === "auth/too-many-requests"
        ) {
            text = "محاولات كثيرة. انتظر قليلاً ثم حاول مجدداً.";
        } else if (
            error.code === "auth/network-request-failed"
        ) {
            text = "تحقق من اتصال الإنترنت.";
        } else if (
            error.code === "auth/operation-not-allowed"
        ) {
            text = "فعّل تسجيل الدخول بالبريد وكلمة المرور في Firebase Authentication.";
        }

        loginMsg(text, "error");

    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "تسجيل الدخول";
    }
});


/* =========================================
   CHECK SESSION
========================================= */

onAuthStateChanged(auth, function(user) {
    if (
        user &&
        user.uid === ADMIN_UID &&
        user.email === ADMIN_EMAIL
    ) {
        loginSection.style.display = "none";
        accountSection.style.display = "block";
    } else {
        loginSection.style.display = "block";
        accountSection.style.display = "none";
    }
});


/* =========================================
   CREATE CUSTOMER ACCOUNT
========================================= */

createAccount.addEventListener("click", async function() {
    const admin = auth.currentUser;

    if (
        !admin ||
        admin.uid !== ADMIN_UID ||
        admin.email !== ADMIN_EMAIL
    ) {
        accountMsg(
            "يجب تسجيل الدخول بالحساب الإداري أولاً.",
            "error"
        );
        return;
    }

    const name = username.value.trim();
    const customerPassword = password.value;
    const type = subscription.value;

    if (!name) {
        accountMsg("أدخل اسم العميل.", "error");
        return;
    }

    if (customerPassword.length < 6) {
        accountMsg(
            "كلمة المرور يجب أن تكون 6 أحرف على الأقل.",
            "error"
        );
        return;
    }

    createAccount.disabled = true;
    createAccount.textContent = "جاري فتح الحساب...";
    message.style.display = "none";

    let customerCreated = false;
    let customerUid = null;

    try {
        /*
         * ابحث عن رقم حساب غير مستخدم.
         */

        const accountNumber =
            await findAvailableAccountNumber();

        /*
         * البريد الداخلي الخاص بحساب العميل.
         */

        const customerEmail =
            accountNumber + "@bok-pedro-new.firebaseapp.com";

        /*
         * أنشئ حساب العميل باستخدام جلسة مستقلة.
         */

        const customerResult =
            await createUserWithEmailAndPassword(
                customerAuth,
                customerEmail,
                customerPassword
            );

        customerCreated = true;
        customerUid = customerResult.user.uid;

        /*
         * احسب بداية ونهاية الاشتراك.
         */

        const now = Date.now();

        const end = now +
            getDays(type) * 24 * 60 * 60 * 1000;

        /*
         * بيانات العميل.
         */

        const userData = {
            username: name,
            accountNumber: accountNumber,
            uid: customerUid,
            email: customerEmail,
            createdAt: now,
            updatedAt: now,
            subscriptionType: type,
            subscriptionName: subscriptionNames[type],
            subscriptionStart: now,
            subscriptionEnd: end,
            active: true,
            disabled: false
        };

        /*
         * احفظ السجلين في قاعدة البيانات.
         */

        await set(
            ref(db, "users/" + customerUid),
            userData
        );

        await set(
            ref(db, "accountNumbers/" + accountNumber),
            {
                uid: customerUid
            }
        );

        /*
         * أخرج حساب العميل من جلسة المصادقة المنفصلة.
         */

        await signOut(customerAuth);

        /*
         * اعرض بيانات الحساب.
         */

        message.innerHTML = "";

        const box = document.createElement("div");
        box.className = "account-box";

        const icon = document.createElement("div");
        icon.className = "success-icon";
        icon.textContent = "✓";
        box.appendChild(icon);

        const title = document.createElement("span");
        title.className = "success-title";
        title.textContent = "تم إنشاء الحساب بنجاح";
        box.appendChild(title);

        function addField(labelText, value, copyClass) {
            const label = document.createElement("div");
            label.className = "account-label";
            label.textContent = labelText;
            box.appendChild(label);

            const valueBox = document.createElement("div");
            valueBox.className = copyClass;
            valueBox.textContent = value;
            box.appendChild(valueBox);

            return valueBox;
        }

        function addCopyButton(text, label) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "account-copy";
            button.textContent = label;

            button.addEventListener("click", function() {
                copyText(text, button);
            });

            box.appendChild(button);
        }

        addField("اسم العميل", name, "account-number");

        addField(
            "رقم الحساب",
            accountNumber,
            "account-number"
        );

        addCopyButton(
            accountNumber,
            "نسخ رقم الحساب"
        );

        addField(
            "كلمة المرور",
            customerPassword,
            "account-password"
        );

        addCopyButton(
            customerPassword,
            "نسخ كلمة المرور"
        );

        addField(
            "مدة الاشتراك",
            subscriptionNames[type],
            "account-number"
        );

        addField(
            "ينتهي الاشتراك في",
            formatDate(end),
            "account-number"
        );

        const note = document.createElement("div");
        note.className = "success-text";
        note.textContent =
            "احتفظ برقم الحساب وكلمة المرور في مكان آمن.";
        box.appendChild(note);

        message.appendChild(box);
        message.className = "message success";
        message.style.display = "block";

        username.value = "";
        password.value = "";

    } catch (error) {
        console.error("Create account error:", error);

        let text = "تعذر إنشاء الحساب: " + error.message;

        if (
            error.code === "auth/email-already-in-use"
        ) {
            text = "البريد الداخلي لهذا الحساب مستخدم بالفعل. حاول مرة أخرى.";
        } else if (
            error.code === "auth/weak-password"
        ) {
            text = "كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل.";
        } else if (
            error.code === "PERMISSION_DENIED" ||
            String(error.message).includes("Permission denied")
        ) {
            text =
                "رفضت قواعد Firebase حفظ البيانات. راجع صلاحيات users وaccountNumbers.";
        }

        if (customerCreated) {
            text +=
                "\nتنبيه: تم إنشاء حساب المصادقة، لكن قد لا تكون كل بياناته قد حُفظت. راجع Firebase Authentication وقاعدة البيانات قبل إعادة المحاولة.";
        }

        accountMsg(text, "error");

    } finally {
        createAccount.disabled = false;
        createAccount.textContent = "فتح الحساب";
    }
});


/* =========================================
   LOGOUT
========================================= */

logoutButton.addEventListener("click", async function() {
    try {
        await signOut(auth);

        loginSection.style.display = "block";
        accountSection.style.display = "none";

        adminPassword.value = "";
        message.innerHTML = "";
        message.style.display = "none";
        loginMessage.style.display = "none";

    } catch (error) {
        console.error(error);

        accountMsg(
            "تعذر تسجيل الخروج. حاول مرة أخرى.",
            "error"
        );
    }
});

</script>

</body>
</html>
