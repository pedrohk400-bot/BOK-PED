// ======================================================
// BOK PEDRO - ADMIN PANEL
// Firebase: bok-pedro-new
// ======================================================

import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    get,
    set,
    update,
    push,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// ======================================================
// 1. FIREBASE CONFIGURATION
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
// 2. ADMIN INFORMATION
// ======================================================

const ADMIN_UID = "gL1GGUJ7FWS4zRZmzdaf60qqHMD3";

const ADMIN_EMAIL = "website-reader@bok-ped.com";


// ======================================================
// 3. INITIALIZE FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getDatabase(app);


// تطبيق منفصل لإنشاء حسابات العملاء.
// يساعد في إبقاء جلسة المدير مستقلة عن جلسة العميل.

const customerApp = initializeApp(
    firebaseConfig,
    "CustomerCreationApp"
);

const customerAuth = getAuth(customerApp);


// ======================================================
// 4. HELPER FUNCTIONS
// ======================================================

function getElement() {
    for (let i = 0; i < arguments.length; i++) {
        const element = document.getElementById(arguments[i]);

        if (element) {
            return element;
        }
    }

    return null;
}


function setText(ids, value) {
    const element = getElement.apply(null, ids);

    if (element) {
        element.textContent = value;
    }
}


function showMessage(message) {
    alert(message);
}


function formatDate(timestamp) {
    if (!timestamp) {
        return "غير محدد";
    }

    const date = new Date(Number(timestamp));

    if (isNaN(date.getTime())) {
        return "غير محدد";
    }

    return date.toLocaleDateString("ar");
}


function escapeHTML(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function generatePassword(length) {
    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

    let password = "";

    for (let i = 0; i < length; i++) {
        password += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    return password;
}


// ======================================================
// 5. SUBSCRIPTION SETTINGS
// ======================================================

function getSubscriptionDays(type) {
    switch (type) {
        case "day":
            return 1;

        case "week":
            return 7;

        case "month":
            return 30;

        case "3months":
            return 90;

        case "12months":
            return 365;

        default:
            return 30;
    }
}


function getSubscriptionName(type) {
    switch (type) {
        case "day":
            return "يوم واحد";

        case "week":
            return "أسبوع";

        case "month":
            return "شهر";

        case "3months":
            return "3 أشهر";

        case "12months":
            return "12 شهرًا";

        default:
            return "شهر";
    }
}


// ======================================================
// 6. ADMIN LOGIN
// ======================================================

async function adminLogin(event) {
    if (event) {
        event.preventDefault();
    }

    const emailInput = getElement(
        "adminEmail",
        "loginEmail",
        "email"
    );

    const passwordInput = getElement(
        "adminPassword",
        "loginPassword",
        "password"
    );

    if (!emailInput || !passwordInput) {
        showMessage(
            "لم يتم العثور على حقول البريد وكلمة المرور في الصفحة."
        );
        return;
    }

    const email = emailInput.value.trim();

    const password = passwordInput.value;

    if (!email || !password) {
        showMessage("أدخل البريد الإلكتروني وكلمة المرور.");
        return;
    }

    try {
        const result = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        if (
            result.user.uid !== ADMIN_UID ||
            result.user.email !== ADMIN_EMAIL
        ) {
            await signOut(auth);

            showMessage("هذا الحساب غير مصرح له بدخول لوحة الإدارة.");

            return;
        }

        showAdminPanel();

        showMessage("تم تسجيل الدخول بنجاح.");

    } catch (error) {
        console.error("Admin login error:", error);

        showMessage(
            "فشل تسجيل الدخول. تحقق من البريد وكلمة المرور وإعدادات Firebase."
        );
    }
}


// ======================================================
// 7. SHOW ADMIN PANEL
// ======================================================

function showAdminPanel() {
    const loginSection = getElement(
        "loginSection",
        "loginContainer",
        "login-form-container"
    );

    const adminSection = getElement(
        "adminPanel",
        "dashboard",
        "adminSection"
    );

    if (loginSection) {
        loginSection.style.display = "none";
    }

    if (adminSection) {
        adminSection.style.display = "block";
    }

    setText(
        ["adminEmailDisplay", "currentAdminEmail"],
        ADMIN_EMAIL
    );
}


// ======================================================
// 8. SHOW LOGIN PAGE
// ======================================================

function showLoginPage() {
    const loginSection = getElement(
        "loginSection",
        "loginContainer",
        "login-form-container"
    );

    const adminSection = getElement(
        "adminPanel",
        "dashboard",
        "adminSection"
    );

    if (loginSection) {
        loginSection.style.display = "block";
    }

    if (adminSection) {
        adminSection.style.display = "none";
    }
}


// ======================================================
// 9. ADMIN SESSION CHECK
// ======================================================

onAuthStateChanged(auth, function(user) {
    if (
        user &&
        user.uid === ADMIN_UID &&
        user.email === ADMIN_EMAIL
    ) {
        showAdminPanel();
    } else {
        if (user) {
            signOut(auth).catch(function(error) {
                console.error(error);
            });
        }

        showLoginPage();
    }
});


// ======================================================
// 10. GENERATE UNIQUE ACCOUNT NUMBER
// ======================================================

async function generateUniqueAccountNumber() {
    for (let attempt = 0; attempt < 30; attempt++) {
        const accountNumber = String(
            Math.floor(1000000 + Math.random() * 9000000)
        );

        const accountRef = ref(
            db,
            "accountNumbers/" + accountNumber
        );

        const snapshot = await get(accountRef);

        if (!snapshot.exists()) {
            return accountNumber;
        }
    }

    throw new Error(
        "تعذر إنشاء رقم حساب فريد. حاول مرة أخرى."
    );
}


// ======================================================
// 11. CREATE CUSTOMER ACCOUNT
// ======================================================

async function createCustomer(event) {
    if (event) {
        event.preventDefault();
    }

    const currentAdmin = auth.currentUser;

    if (
        !currentAdmin ||
        currentAdmin.uid !== ADMIN_UID ||
        currentAdmin.email !== ADMIN_EMAIL
    ) {
        showMessage("يجب تسجيل الدخول بحساب المدير أولًا.");
        return;
    }

    const usernameInput = getElement(
        "customerName",
        "username",
        "customerUsername"
    );

    const subscriptionInput = getElement(
        "subscriptionType",
        "subscription",
        "subscriptionDuration"
    );

    if (!usernameInput || !subscriptionInput) {
        showMessage(
            "تأكد من وجود حقلي اسم العميل ونوع الاشتراك في HTML."
        );
        return;
    }

    const username = usernameInput.value.trim();

    const subscriptionType = subscriptionInput.value;

    if (!username) {
        showMessage("أدخل اسم العميل.");
        return;
    }

    const allowedTypes = [
        "day",
        "week",
        "month",
        "3months",
        "12months"
    ];

    if (allowedTypes.indexOf(subscriptionType) === -1) {
        showMessage("نوع الاشتراك غير صحيح.");
        return;
    }

    let customerPassword = generatePassword(10);

    let customerUid = null;

    let accountNumber = null;

    let customerCreated = false;

    try {
        const createButton = getElement(
            "createCustomerButton",
            "createAccountButton",
            "createUserBtn"
        );

        if (createButton) {
            createButton.disabled = true;
        }

        // إعادة التحقق من جلسة المدير قبل العملية الحساسة.

        await currentAdmin.getIdToken(true);

        if (
            auth.currentUser.uid !== ADMIN_UID ||
            auth.currentUser.email !== ADMIN_EMAIL
        ) {
            throw new Error("جلسة المدير غير صالحة.");
        }

        // إنشاء رقم حساب غير مستخدم.

        accountNumber = await generateUniqueAccountNumber();

        // البريد الذي سيُستخدم في Firebase Authentication.

        const customerEmail =
            accountNumber + "@bok-pedro-new.firebaseapp.com";

        // إنشاء حساب العميل في المشروع الجديد.

        const credential = await import(
            "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"
        ).then(function(module) {
            return module.createUserWithEmailAndPassword(
                customerAuth,
                customerEmail,
                customerPassword
            );
        });

        customerUid = credential.user.uid;

        customerCreated = true;

        const now = Date.now();

        const subscriptionDays =
            getSubscriptionDays(subscriptionType);

        const subscriptionEnd =
            now + subscriptionDays * 24 * 60 * 60 * 1000;

        // حفظ بيانات العميل.

        const userData = {
            username: username,
            accountNumber: accountNumber,
            uid: customerUid,
            email: customerEmail,

            createdAt: now,

            subscriptionType: subscriptionType,

            subscriptionName:
                getSubscriptionName(subscriptionType),

            subscriptionStart: now,

            subscriptionEnd: subscriptionEnd,

            active: true,

            disabled: false,

            updatedAt: now
        };

        // حفظ بيانات الحساب في قاعدة البيانات.

        await set(
            ref(db, "users/" + customerUid),
            userData
        );

        // ربط رقم الحساب بمعرف العميل.

        await set(
            ref(db, "accountNumbers/" + accountNumber),
            {
                uid: customerUid,
                accountNumber: accountNumber,
                createdAt: now
            }
        );

        // تسجيل نجاح العملية في الواجهة.

        showCreatedCustomer({
            username: username,
            accountNumber: accountNumber,
            password: customerPassword,
            email: customerEmail,
            subscriptionName:
                getSubscriptionName(subscriptionType),
            subscriptionEnd: subscriptionEnd
        });

        usernameInput.value = "";

        showMessage("تم إنشاء حساب العميل بنجاح.");

    } catch (error) {
        console.error("Create customer error:", error);

        if (customerCreated && customerUid) {
            showMessage(
                "تم إنشاء حساب المصادقة، لكن تعذر إكمال حفظ بياناته. " +
                "راجع صلاحيات Realtime Database قبل إعادة المحاولة. " +
                "رقم الحساب: " + accountNumber
            );
        } else {
            showMessage(
                "فشل إنشاء الحساب: " +
                (error.message || "خطأ غير معروف")
            );
        }

    } finally {
        if (customerAuth.currentUser) {
            try {
                await signOut(customerAuth);
            } catch (error) {
                console.error("Customer sign out error:", error);
            }
        }

        const createButton = getElement(
            "createCustomerButton",
            "createAccountButton",
            "createUserBtn"
        );

        if (createButton) {
            createButton.disabled = false;
        }
    }
}


// ======================================================
// 12. DISPLAY CREATED CUSTOMER
// ======================================================

function showCreatedCustomer(customer) {
    const resultContainer = getElement(
        "customerResult",
        "createdCustomer",
        "resultContainer"
    );

    const accountElement = getElement(
        "resultAccountNumber",
        "createdAccountNumber",
        "accountNumberResult"
    );

    const passwordElement = getElement(
        "resultPassword",
        "createdPassword",
        "passwordResult"
    );

    const usernameElement = getElement(
        "resultUsername",
        "createdUsername",
        "usernameResult"
    );

    const emailElement = getElement(
        "resultEmail",
        "createdEmail",
        "emailResult"
    );

    const subscriptionElement = getElement(
        "resultSubscription",
        "createdSubscription"
    );

    const endElement = getElement(
        "resultSubscriptionEnd",
        "subscriptionEnd"
    );

    if (accountElement) {
        accountElement.textContent = customer.accountNumber;
    }

    if (passwordElement) {
        passwordElement.textContent = customer.password;
    }

    if (usernameElement) {
        usernameElement.textContent = customer.username;
    }

    if (emailElement) {
        emailElement.textContent = customer.email;
    }

    if (subscriptionElement) {
        subscriptionElement.textContent =
            customer.subscriptionName;
    }

    if (endElement) {
        endElement.textContent =
            formatDate(customer.subscriptionEnd);
    }

    if (resultContainer) {
        resultContainer.style.display = "block";
    }

    // الاحتفاظ ببيانات آخر حساب تم إنشاؤه لنسخها.

    window.lastCreatedCustomer = customer;
}


// ======================================================
// 13. COPY TEXT
// ======================================================

async function copyText(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(String(text));

            showMessage("تم النسخ بنجاح.");

            return;
        }

        const textarea = document.createElement("textarea");

        textarea.value = String(text);

        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";

        document.body.appendChild(textarea);

        textarea.select();

        const copied = document.execCommand("copy");

        document.body.removeChild(textarea);

        if (copied) {
            showMessage("تم النسخ بنجاح.");
        } else {
            showMessage("تعذر النسخ تلقائيًا.");
        }

    } catch (error) {
        console.error("Copy error:", error);

        showMessage("تعذر النسخ.");
    }
}


// ======================================================
// 14. COPY ACCOUNT NUMBER
// ======================================================

function copyAccountNumber() {
    if (
        window.lastCreatedCustomer &&
        window.lastCreatedCustomer.accountNumber
    ) {
        copyText(
            window.lastCreatedCustomer.accountNumber
        );
    }
}


// ======================================================
// 15. COPY PASSWORD
// ======================================================

function copyCustomerPassword() {
    if (
        window.lastCreatedCustomer &&
        window.lastCreatedCustomer.password
    ) {
        copyText(
            window.lastCreatedCustomer.password
        );
    }
}


// ======================================================
// 16. COPY CUSTOMER DETAILS
// ======================================================

function copyCustomerDetails() {
    const customer = window.lastCreatedCustomer;

    if (!customer) {
        showMessage("لا توجد بيانات حساب لنسخها.");
        return;
    }

    const details =
        "BOK PEDRO\n" +
        "اسم العميل: " + customer.username + "\n" +
        "رقم الحساب: " + customer.accountNumber + "\n" +
        "كلمة المرور: " + customer.password + "\n" +
        "البريد: " + customer.email + "\n" +
        "الاشتراك: " + customer.subscriptionName + "\n" +
        "تاريخ الانتهاء: " +
        formatDate(customer.subscriptionEnd);

    copyText(details);
}


// ======================================================
// 17. ADMIN LOGOUT
// ======================================================

async function adminLogout() {
    try {
        await signOut(auth);

        showLoginPage();

        showMessage("تم تسجيل الخروج.");

    } catch (error) {
        console.error("Logout error:", error);

        showMessage("تعذر تسجيل الخروج.");
    }
}


// ======================================================
// 18. CONNECT BUTTONS AND FORMS
// ======================================================

document.addEventListener("DOMContentLoaded", function() {

    const loginForm = getElement(
        "loginForm",
        "adminLoginForm"
    );

    if (loginForm) {
        loginForm.addEventListener(
            "submit",
            adminLogin
        );
    }

    const loginButton = getElement(
        "loginButton",
        "adminLoginButton",
        "loginBtn"
    );

    if (loginButton && !loginForm) {
        loginButton.addEventListener(
            "click",
            adminLogin
        );
    }

    const createForm = getElement(
        "createCustomerForm",
        "createAccountForm",
        "createUserForm"
    );

    if (createForm) {
        createForm.addEventListener(
            "submit",
            createCustomer
        );
    }

    const createButton = getElement(
        "createCustomerButton",
        "createAccountButton",
        "createUserBtn"
    );

    if (createButton && !createForm) {
        createButton.addEventListener(
            "click",
            createCustomer
        );
    }

    const logoutButton = getElement(
        "logoutButton",
        "adminLogoutButton",
        "logoutBtn"
    );

    if (logoutButton) {
        logoutButton.addEventListener(
            "click",
            adminLogout
        );
    }

    const copyAccountButton = getElement(
        "copyAccountButton",
        "copyAccountNumber"
    );

    if (copyAccountButton) {
        copyAccountButton.addEventListener(
            "click",
            copyAccountNumber
        );
    }

    const copyPasswordButton = getElement(
        "copyPasswordButton",
        "copyCustomerPassword"
    );

    if (copyPasswordButton) {
        copyPasswordButton.addEventListener(
            "click",
            copyCustomerPassword
        );
    }

    const copyDetailsButton = getElement(
        "copyDetailsButton",
        "copyCustomerDetails"
    );

    if (copyDetailsButton) {
        copyDetailsButton.addEventListener(
            "click",
            copyCustomerDetails
        );
    }

});


// ======================================================
// 19. GLOBAL FUNCTIONS FOR HTML ONCLICK
// ======================================================

window.adminLogin = adminLogin;

window.adminLogout = adminLogout;

window.createCustomer = createCustomer;

window.copyText = copyText;

window.copyAccountNumber = copyAccountNumber;

window.copyCustomerPassword = copyCustomerPassword;

window.copyCustomerDetails = copyCustomerDetails;
