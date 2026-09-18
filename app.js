import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


import {
    getDatabase,
    ref,
    get,
    set
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// =====================================================
// Firebase Configuration
// =====================================================

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


// =====================================================
// Firebase App الرئيسي
// =====================================================

const app =
    initializeApp(
        firebaseConfig
    );


// =====================================================
// Auth المسؤول
// =====================================================

const auth =
    getAuth(
        app
    );


// =====================================================
// Database
// =====================================================

const db =
    getDatabase(
        app
    );


// =====================================================
// Firebase App ثانوي
//
// يستخدم لإنشاء حساب العميل
// بدون تسجيل خروج المسؤول
// =====================================================

const customerApp =
    initializeApp(
        firebaseConfig,
        "CustomerCreationApp"
    );


const customerAuth =
    getAuth(
        customerApp
    );


// =====================================================
// UID الحساب الإداري
// =====================================================

const ADMIN_UID =
    "zuwXPgS4TPYF5GyAYEPEOrsYV0z1";


// =====================================================
// عناصر تسجيل الدخول
// =====================================================

const loginSection =
    document.getElementById(
        "loginSection"
    );


const accountSection =
    document.getElementById(
        "accountSection"
    );


const adminEmail =
    document.getElementById(
        "adminEmail"
    );


const adminPassword =
    document.getElementById(
        "adminPassword"
    );


const loginButton =
    document.getElementById(
        "loginButton"
    );


const loginMessage =
    document.getElementById(
        "loginMessage"
    );


const logoutButton =
    document.getElementById(
        "logoutButton"
    );


// =====================================================
// عناصر فتح الحساب
// =====================================================

const usernameInput =
    document.getElementById(
        "username"
    );


const passwordInput =
    document.getElementById(
        "password"
    );


const subscriptionInput =
    document.getElementById(
        "subscription"
    );


const subscriptionInfo =
    document.getElementById(
        "subscriptionInfo"
    );


const createButton =
    document.getElementById(
        "createAccount"
    );


const message =
    document.getElementById(
        "message"
    );


// =====================================================
// حالة المسؤول
// =====================================================

let adminAuthorized =
    false;


// =====================================================
// عرض رسالة تسجيل الدخول
// =====================================================

function showLoginMessage(
    text,
    type = ""
) {

    loginMessage.className =
        "message " + type;

    loginMessage.innerHTML =
        text;
}


// =====================================================
// عرض رسالة فتح الحساب
// =====================================================

function showMessage(
    text,
    type = ""
) {

    message.className =
        "message " + type;

    message.innerHTML =
        text;
}


// =====================================================
// أسماء الاشتراكات
// =====================================================

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


// =====================================================
// تحديث الاشتراك
// =====================================================

function updateSubscriptionInfo() {

    const type =
        subscriptionInput.value;


    const name =
        subscriptionNames[type] ||
        "يوم واحد";


    subscriptionInfo.innerHTML =
        `مدة الاشتراك: <strong>${name}</strong>`;
}


subscriptionInput.addEventListener(
    "change",
    updateSubscriptionInfo
);


updateSubscriptionInfo();


// =====================================================
// حماية HTML
// =====================================================

function escapeHTML(
    text
) {

    return text
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// =====================================================
// حساب نهاية الاشتراك
// =====================================================

function calculateSubscriptionEnd(
    startDate,
    subscriptionType
) {

    const endDate =
        new Date(
            startDate.getTime()
        );


    switch (
        subscriptionType
    ) {

        case "day":

            endDate.setDate(
                endDate.getDate() + 1
            );

            break;


        case "week":

            endDate.setDate(
                endDate.getDate() + 7
            );

            break;


        case "month":

            endDate.setMonth(
                endDate.getMonth() + 1
            );

            break;


        case "3months":

            endDate.setMonth(
                endDate.getMonth() + 3
            );

            break;


        case "12months":

            endDate.setFullYear(
                endDate.getFullYear() + 1
            );

            break;


        default:

            throw new Error(
                "مدة الاشتراك غير صحيحة."
            );
    }


    return endDate;
}


// =====================================================
// تنسيق التاريخ
// =====================================================

function formatDate(
    date
) {

    return new Intl.DateTimeFormat(
        "ar-EG",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    ).format(date);
}


// =====================================================
// توليد رقم حساب 7 أرقام
// =====================================================

function generateAccountNumber() {

    return Math.floor(
        1000000 +
        Math.random() * 9000000
    ).toString();
}


// =====================================================
// البحث عن رقم حساب غير مستخدم
// =====================================================

async function getAvailableAccountNumber() {

    const maxAttempts =
        30;


    for (
        let attempt = 0;
        attempt < maxAttempts;
        attempt++
    ) {

        const accountNumber =
            generateAccountNumber();


        const accountRef =
            ref(
                db,
                "accountNumbers/" +
                accountNumber
            );


        const snapshot =
            await get(
                accountRef
            );


        if (
            !snapshot.exists()
        ) {

            return accountNumber;
        }
    }


    throw new Error(
        "لم يتم العثور على رقم حساب متاح."
    );
}


// =====================================================
// تسجيل دخول المسؤول
// =====================================================

loginButton.addEventListener(
    "click",
    async () => {

        const email =
            adminEmail.value.trim();


        const password =
            adminPassword.value;


        // ---------------------------------------------
        // التحقق من البريد
        // ---------------------------------------------

        if (
            !email
        ) {

            showLoginMessage(
                "أدخل البريد الإلكتروني.",
                "error"
            );

            return;
        }


        // ---------------------------------------------
        // التحقق من كلمة المرور
        // ---------------------------------------------

        if (
            !password
        ) {

            showLoginMessage(
                "أدخل كلمة المرور.",
                "error"
            );

            return;
        }


        // ---------------------------------------------
        // تعطيل الزر
        // ---------------------------------------------

        loginButton.disabled =
            true;

        loginButton.textContent =
            "جاري تسجيل الدخول...";


        showLoginMessage(
            "جاري التحقق...",
            "loading"
        );


        try {

            const result =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                result.user;


            // =========================================
            // التحقق من UID
            // =========================================

            if (
                user.uid !==
                ADMIN_UID
            ) {

                await signOut(
                    auth
                );


                throw {
                    code:
                        "admin/not-authorized"
                };
            }


            // =========================================
            // تم تسجيل الدخول
            // =========================================

            adminAuthorized =
                true;


            showLoginMessage(
                "تم تسجيل الدخول بنجاح.",
                "success"
            );


        } catch (error) {

            console.error(
                "Login Error:",
                error
            );


            let errorMessage =
                "تعذر تسجيل الدخول.";


            switch (
                error.code
            ) {

                case "auth/invalid-credential":

                    errorMessage =
                        "البريد الإلكتروني أو كلمة المرور غير صحيحة.";

                    break;


                case "auth/invalid-email":

                    errorMessage =
                        "البريد الإلكتروني غير صحيح.";

                    break;


                case "auth/user-disabled":

                    errorMessage =
                        "هذا الحساب تم تعطيله.";

                    break;


                case "auth/too-many-requests":

                    errorMessage =
                        "تم إجراء محاولات كثيرة. حاول لاحقًا.";

                    break;


                case "auth/network-request-failed":

                    errorMessage =
                        "تأكد من اتصال الإنترنت.";

                    break;


                case "admin/not-authorized":

                    errorMessage =
                        "هذا الحساب ليس حسابًا إداريًا.";

                    break;


                default:

                    if (
                        error.message
                    ) {

                        errorMessage =
                            error.message;
                    }

                    break;
            }


            adminAuthorized =
                false;


            showLoginMessage(
                errorMessage,
                "error"
            );

        }


        loginButton.disabled =
            false;

        loginButton.textContent =
            "تسجيل الدخول";
    }
);


// =====================================================
// مراقبة جلسة Firebase
// =====================================================

onAuthStateChanged(
    auth,
    async (user) => {

        // =============================================
        // لا يوجد مستخدم
        // =============================================

        if (!user) {

            adminAuthorized =
                false;


            loginSection.style.display =
                "block";


            accountSection.style.display =
                "none";


            return;
        }


        // =============================================
        // مستخدم غير إداري
        // =============================================

        if (
            user.uid !==
            ADMIN_UID
        ) {

            adminAuthorized =
                false;


            await signOut(
                auth
            );


            loginSection.style.display =
                "block";


            accountSection.style.display =
                "none";


            showLoginMessage(
                "غير مسموح. هذا الحساب ليس حسابًا إداريًا.",
                "error"
            );


            return;
        }


        // =============================================
        // المسؤول
        // =============================================

        adminAuthorized =
            true;


        loginSection.style.display =
            "none";


        accountSection.style.display =
            "block";


        showMessage(
            "تم التحقق من الحساب الإداري. يمكنك فتح الحسابات.",
            "success"
        );
    }
);


// =====================================================
// تسجيل الخروج
// =====================================================

logoutButton.addEventListener(
    "click",
    async () => {

        try {

            await signOut(
                auth
            );


            adminAuthorized =
                false;


            showLoginMessage(
                "تم تسجيل الخروج.",
                "success"
            );


        } catch (error) {

            console.error(
                "Logout Error:",
                error
            );


            showLoginMessage(
                "تعذر تسجيل الخروج.",
                "error"
            );
        }
    }
);


// =====================================================
// فتح الحساب
// =====================================================

createButton.addEventListener(
    "click",
    async () => {

        // =============================================
        // حماية المسؤول
        // =============================================

        const currentAdmin =
            auth.currentUser;


        if (
            !adminAuthorized ||
            !currentAdmin ||
            currentAdmin.uid !==
            ADMIN_UID
        ) {

            showMessage(
                "غير مسموح. يجب تسجيل الدخول بالحساب الإداري.",
                "error"
            );

            return;
        }


        // =============================================
        // البيانات
        // =============================================

        const username =
            usernameInput.value.trim();


        const password =
            passwordInput.value;


        const subscriptionType =
            subscriptionInput.value;


        // =============================================
        // اسم المستخدم
        // =============================================

        if (
            username.length < 3
        ) {

            showMessage(
                "اسم المستخدم يجب أن يكون 3 أحرف على الأقل.",
                "error"
            );

            return;
        }


        // =============================================
        // كلمة المرور
        // =============================================

        if (
            password.length < 6
        ) {

            showMessage(
                "كلمة المرور يجب أن تكون 6 أحرف على الأقل.",
                "error"
            );

            return;
        }


        // =============================================
        // الاشتراك
        // =============================================

        if (
            !subscriptionNames[
                subscriptionType
            ]
        ) {

            showMessage(
                "يرجى اختيار مدة اشتراك صحيحة.",
                "error"
            );

            return;
        }


        // =============================================
        // تعطيل الزر
        // =============================================

        createButton.disabled =
            true;

        createButton.textContent =
            "جاري إنشاء الحساب...";


        showMessage(
            "جاري إنشاء الحساب...",
            "loading"
        );


        try {

            // =========================================
            // بداية الاشتراك
            // =========================================

            const subscriptionStart =
                new Date();


            // =========================================
            // نهاية الاشتراك
            // =========================================

            const subscriptionEnd =
                calculateSubscriptionEnd(
                    subscriptionStart,
                    subscriptionType
                );


            // =========================================
            // رقم الحساب
            // =========================================

            const accountNumber =
                await getAvailableAccountNumber();


            // =========================================
            // البريد الداخلي
            // =========================================

            const email =
                accountNumber +
                "@bok-ped.firebaseapp.com";


            // =========================================
            // إنشاء العميل في Firebase Auth
            //
            // التطبيق الثانوي يحافظ على جلسة المسؤول
            // =========================================

            const userCredential =
                await createUserWithEmailAndPassword(
                    customerAuth,
                    email,
                    password
                );


            const uid =
                userCredential.user.uid;


            // =========================================
            // حفظ users
            // =========================================

            await set(
                ref(
                    db,
                    "users/" + uid
                ),
                {

                    username:
                        username,

                    accountNumber:
                        accountNumber,

                    uid:
                        uid,

                    createdAt:
                        Date.now(),

                    subscriptionType:
                        subscriptionType,

                    subscriptionName:
                        subscriptionNames[
                            subscriptionType
                        ],

                    subscriptionStart:
                        subscriptionStart.getTime(),

                    subscriptionEnd:
                        subscriptionEnd.getTime(),

                    active:
                        true
                }
            );


            // =========================================
            // حفظ accountNumbers
            // =========================================

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


            // =========================================
            // تسجيل خروج التطبيق الثانوي
            // =========================================

            await signOut(
                customerAuth
            );


            // =========================================
            // نجاح
            // =========================================

            showMessage(

                `
                <div class="success-title">
                    تم إنشاء الحساب بنجاح 🎉
                </div>

                <div class="account-box">

                    <div class="account-label">
                        اسم المستخدم
                    </div>

                    <strong>
                        ${escapeHTML(username)}
                    </strong>


                    <div class="account-label">
                        رقم الحساب
                    </div>

                    <div class="account-number">
                        ${accountNumber}
                    </div>


                    <div class="account-label">
                        مدة الاشتراك
                    </div>

                    <strong>
                        ${
                            subscriptionNames[
                                subscriptionType
                            ]
                        }
                    </strong>


                    <div class="account-label">
                        ينتهي الاشتراك في
                    </div>

                    <div class="subscription-end">
                        ${
                            formatDate(
                                subscriptionEnd
                            )
                        }
                    </div>

                </div>


                <p class="success-text">
                    احتفظ برقم الحساب وكلمة المرور.
                </p>
                `,

                "success"
            );


            // =========================================
            // تنظيف الحقول
            // =========================================

            usernameInput.value =
                "";

            passwordInput.value =
                "";

            subscriptionInput.value =
                "day";

            updateSubscriptionInfo();


        } catch (error) {

            console.error(
                "Create Account Error:",
                error
            );


            let errorMessage =
                "حدث خطأ أثناء إنشاء الحساب.";


            switch (
                error.code
            ) {

                case "auth/email-already-in-use":

                    errorMessage =
                        "رقم الحساب موجود بالفعل. اضغط مرة أخرى لإنشاء رقم جديد.";

                    break;


                case "auth/weak-password":

                    errorMessage =
                        "كلمة المرور ضعيفة. استخدم 6 أحرف أو أكثر.";

                    break;


                case "auth/operation-not-allowed":

                    errorMessage =
                        "تسجيل الدخول بالبريد الإلكتروني غير مفعّل في Firebase Authentication.";

                    break;


                case "auth/network-request-failed":

                    errorMessage =
                        "تأكد من اتصال الإنترنت.";

                    break;


                case "PERMISSION_DENIED":

                    errorMessage =
                        "قواعد Firebase تمنع حفظ البيانات.";

                    break;


                default:

                    if (
                        error.message
                    ) {

                        errorMessage =
                            error.message;
                    }

                    break;
            }


            showMessage(
                errorMessage,
                "error"
            );

        }


        // =============================================
        // إعادة الزر
        // =============================================

        createButton.disabled =
            !adminAuthorized;

        createButton.textContent =
            "فتح الحساب";
    }
);
