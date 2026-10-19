// ======================================================
// BOK PEDRO - ADMIN PANEL
// Firebase Project: bok-pedro-new
// ======================================================

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


// ======================================================
// FIREBASE CONFIG - NEW PROJECT
// ======================================================

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


// ======================================================
// ADMIN
// ======================================================

const ADMIN_UID = "gL1GGUJ7FWS4zRZmzdaf60qqHMD3";

const ADMIN_EMAIL = "website-reader@bok-ped.com";


// ======================================================
// INITIALIZE FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getDatabase(app);


// ======================================================
// CUSTOMER AUTH
// استخدام تطبيق منفصل حتى لا يتأثر دخول المدير
// ======================================================

const customerApp = initializeApp(
    firebaseConfig,
    "CustomerCreationApp"
);

const customerAuth = getAuth(customerApp);


// ======================================================
// HTML ELEMENTS
// ======================================================

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


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ======================================================
// LOGIN MESSAGE
// ======================================================

function loginMsg(text, type) {
    loginMessage.textContent = text;
    loginMessage.style.display = "block";
    loginMessage.className = "message " + type;
}


// ======================================================
// ACCOUNT MESSAGE
// ======================================================

function accountMsg(text, type) {
    message.textContent = text;
    message.style.display = "block";
    message.className = "message " + type;
}


// ======================================================
// SUBSCRIPTION TYPES
// ======================================================

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

    return 1;
}


// ======================================================
// UPDATE SUBSCRIPTION INFO
// ======================================================

function updateSubscriptionInfo() {
    if (!subscription || !subscriptionInfo) return;

    const type = subscription.value;
    const days = getDays(type);

    subscriptionInfo.textContent =
        "مدة الاشتراك: " +
        (subscriptionNames[type] || "يوم واحد") +
        " (" + days + " يوم)";
}


if (subscription) {
    subscription.addEventListener(
        "change",
        updateSubscriptionInfo
    );

    updateSubscriptionInfo();
}


// ======================================================
// GENERATE UNIQUE 7-DIGIT ACCOUNT NUMBER
// ======================================================

function generateAccountNumber() {
    return String(
        Math.floor(1000000 + Math.random() * 9000000)
    );
}


// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(timestamp) {
    return new Intl.DateTimeFormat("ar", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(timestamp));
}


// ======================================================
// COPY TEXT
// ======================================================

async function copyText(text, button) {
    const oldText = button.textContent;

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(String(text));
        } else {
            const input = document.createElement("textarea");

            input.value = String(text);
            input.style.position = "fixed";
            input.style.opacity = "0";

            document.body.appendChild(input);

            input.select();

            const copied = document.execCommand("copy");

            input.remove();

            if (!copied) {
                throw new Error("تعذر نسخ النص");
            }
        }

        button.textContent = "تم النسخ ✓";

    } catch (error) {
        console.error("Copy error:", error);
        button.textContent = "فشل النسخ";
    }

    setTimeout(function () {
        button.textContent = oldText;
    }, 1500);
}


// ======================================================
// CHECK ADMIN IDENTITY
// ======================================================

function isAdmin(user) {
    return !!user &&
        user.uid === ADMIN_UID &&
        user.email === ADMIN_EMAIL;
}


// ======================================================
// SHOW ADMIN PANEL
// ======================================================

function showAdminPanel() {
    loginSection.style.display = "none";
    accountSection.style.display = "block";
}


// ======================================================
// SHOW LOGIN
// ======================================================

function showLoginPanel() {
    loginSection.style.display = "block";
    accountSection.style.display = "none";
}


// ======================================================
// ADMIN LOGIN
// ======================================================

if (loginButton) {
    loginButton.addEventListener("click", async function (event) {

        event.preventDefault();

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

            if (!isAdmin(user)) {
                await signOut(auth);

                loginMsg(
                    "هذا الحساب غير مصرح له بدخول لوحة الإدارة.",
                    "error"
                );

                return;
            }

            await user.getIdToken(true);

            showAdminPanel();

            loginMsg("تم تسجيل الدخول بنجاح.", "success");

        } catch (error) {
            console.error(
                "BOK PEDRO Login Error:",
                error.code,
                error.message
            );

            let text;

            switch (error.code) {
                case "auth/invalid-credential":
                case "auth/invalid-login-credentials":
                    text = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
                    break;

                case "auth/user-not-found":
                    text = "حساب المدير غير موجود في Firebase Authentication.";
                    break;

                case "auth/wrong-password":
                    text = "كلمة المرور غير صحيحة.";
                    break;

                case "auth/invalid-email":
                    text = "صيغة البريد الإلكتروني غير صحيحة.";
                    break;

                case "auth/user-disabled":
                    text = "حساب المدير معطّل.";
                    break;

                case "auth/too-many-requests":
                    text = "محاولات كثيرة. انتظر قليلًا ثم حاول مجددًا.";
                    break;

                case "auth/network-request-failed":
                    text = "فشل الاتصال. تحقق من الإنترنت.";
                    break;

                case "auth/operation-not-allowed":
                    text = "فعّل Email/Password في Firebase Authentication.";
                    break;

                case "auth/unauthorized-domain":
                    text = "أضف نطاق الموقع إلى Authorized domains في Firebase.";
                    break;

                case "auth/invalid-api-key":
                    text = "مفتاح Firebase API غير صالح.";
                    break;

                case "auth/app-not-authorized":
                    text = "تطبيق الويب غير مخوّل لهذا المشروع.";
                    break;

                case "auth/requests-from-referer-blocked":
                    text = "تم رفض الطلب بسبب قيود مفتاح API أو نطاق الموقع.";
                    break;

                default:
                    text =
                        "رمز الخطأ: " + (error.code || "غير معروف") +
                        "\nالتفاصيل: " + (error.message || "لا توجد تفاصيل");
            }

            loginMsg(text, "error");

        } finally {
            loginButton.disabled = false;
            loginButton.textContent = "تسجيل الدخول";
        }
    });
}


// ======================================================
// AUTH SESSION
// ======================================================

onAuthStateChanged(auth, function (user) {
    if (isAdmin(user)) {
        showAdminPanel();
    } else {
        showLoginPanel();
    }
});


// ======================================================
// CREATE CUSTOMER ACCOUNT
// ======================================================

if (createAccount) {
    createAccount.addEventListener("click", async function (event) {

        event.preventDefault();

        const admin = auth.currentUser;

        if (!isAdmin(admin)) {
            accountMsg(
                "يجب تسجيل الدخول بحساب المدير أولًا.",
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

        if (customerPassword.length < 3) {
            accountMsg(
                "كلمة المرور يجب أن تكون 3 أحرف على الأقل.",
                "error"
            );
            return;
        }

        if (!subscriptionNames[type]) {
            accountMsg("اختر نوع اشتراك صحيح.", "error");
            return;
        }

        createAccount.disabled = true;
        createAccount.textContent = "جاري إنشاء الحساب...";

        let createdCustomer = null;

        try {

            // تأكيد جلسة المدير قبل البدء
            if (!isAdmin(auth.currentUser)) {
                throw new Error("انتهت جلسة المدير. سجّل الدخول مجددًا.");
            }

            // البحث عن رقم حساب غير مستخدم
            let accountNumber = "";
            let exists = true;
            let attempts = 0;

            while (exists && attempts < 30) {
                attempts++;

                accountNumber = generateAccountNumber();

                const accountSnapshot = await get(
                    ref(db, "accountNumbers/" + accountNumber)
                );

                exists = accountSnapshot.exists();
            }

            if (exists) {
                throw new Error(
                    "تعذر العثور على رقم حساب متاح. حاول مرة أخرى."
                );
            }

            // بريد العميل في مشروع Firebase الجديد
            const customerEmail =
                accountNumber + "@bok-pedro-new.firebaseapp.com";

            // إنشاء حساب المصادقة باستخدام التطبيق المنفصل
            const customerResult =
                await createUserWithEmailAndPassword(
                    customerAuth,
                    customerEmail,
                    customerPassword
                );

            createdCustomer = customerResult.user;

            const uid = createdCustomer.uid;

            const now = Date.now();

            const end = now +
                (
                    getDays(type) *
                    24 * 60 * 60 * 1000
                );

            // بيانات العميل
            const userData = {
                username: name,
                accountNumber: accountNumber,
                uid: uid,
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

            // حفظ بيانات العميل
            await set(
                ref(db, "users/" + uid),
                userData
            );

            // ربط رقم الحساب بمعرّف العميل
            await set(
                ref(db, "accountNumbers/" + accountNumber),
                {
                    uid: uid
                }
            );

            // تسجيل خروج حساب العميل من التطبيق المنفصل
            await signOut(customerAuth);

            // عرض بيانات الحساب
            message.innerHTML = `
                <div class="account-box">

                    <div class="success-icon">✓</div>

                    <span class="success-title">
                        تم إنشاء الحساب بنجاح
                    </span>

                    <div class="account-label">اسم العميل</div>
                    <strong>${escapeHTML(name)}</strong>

                    <div class="account-label">رقم الحساب</div>
                    <div class="account-number">
                        ${escapeHTML(accountNumber)}
                    </div>

                    <button
                        type="button"
                        class="account-copy"
                        id="copyAccountButton">
                        نسخ رقم الحساب
                    </button>

                    <div class="account-label">كلمة المرور</div>
                    <div class="account-password">
                        ${escapeHTML(customerPassword)}
                    </div>

                    <button
                        type="button"
                        class="password-copy"
                        id="copyPasswordButton">
                        نسخ كلمة المرور
                    </button>

                    <div class="account-label">البريد الداخلي للحساب</div>
                    <strong>${escapeHTML(customerEmail)}</strong>

                    <div class="account-label">مدة الاشتراك</div>
                    <strong>${escapeHTML(subscriptionNames[type])}</strong>

                    <div class="account-label">تاريخ انتهاء الاشتراك</div>
                    <strong>${escapeHTML(formatDate(end))}</strong>

                    <div class="success-text">
                        احتفظ برقم الحساب وكلمة المرور في مكان آمن.
                    </div>

                </div>
            `;

            message.style.display = "block";
            message.className = "message success";

            const copyAccountButton =
                document.getElementById("copyAccountButton");

            const copyPasswordButton =
                document.getElementById("copyPasswordButton");

            if (copyAccountButton) {
                copyAccountButton.addEventListener("click", function () {
                    copyText(accountNumber, copyAccountButton);
                });
            }

            if (copyPasswordButton) {
                copyPasswordButton.addEventListener("click", function () {
                    copyText(customerPassword, copyPasswordButton);
                });
            }

            username.value = "";
            password.value = "";

        } catch (error) {
            console.error(
                "Create customer error:",
                error.code,
                error.message
            );

            let errorText = error.message || "حدث خطأ غير معروف.";

            if (error.code === "auth/email-already-in-use") {
                errorText = "البريد الداخلي لهذا الحساب مستخدم مسبقًا.";
            } else if (error.code === "auth/weak-password") {
                errorText = "كلمة المرور ضعيفة؛ استخدم كلمة مرور أقوى.";
            } else if (error.code === "auth/operation-not-allowed") {
                errorText = "فعّل Email/Password في Firebase Authentication.";
            } else if (error.code === "auth/network-request-failed") {
                errorText = "تحقق من اتصال الإنترنت.";
            } else if (error.code === "PERMISSION_DENIED") {
                errorText =
                    "رفض Firebase الكتابة. راجع قواعد Realtime Database.";
            }

            accountMsg(
                "تعذر إكمال إنشاء الحساب.\n" + errorText,
                "error"
            );

            // محاولة تنظيف جلسة العميل إن أمكن
            try {
                await signOut(customerAuth);
            } catch (ignored) {
                console.error("Customer sign-out error:", ignored);
            }

        } finally {
            createAccount.disabled = false;
            createAccount.textContent = "فتح الحساب";
        }
    });
}


// ======================================================
// LOGOUT
// ======================================================

if (logoutButton) {
    logoutButton.addEventListener("click", async function () {

        logoutButton.disabled = true;

        try {
            await signOut(auth);

            adminPassword.value = "";

            message.innerHTML = "";
            message.style.display = "none";

            loginMessage.textContent = "";
            loginMessage.style.display = "none";

            showLoginPanel();

        } catch (error) {
            console.error("Logout error:", error);

            accountMsg(
                "تعذر تسجيل الخروج: " + error.message,
                "error"
            );

        } finally {
            logoutButton.disabled = false;
        }
    });
}
