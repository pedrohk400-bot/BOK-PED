import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    get,
    set
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// ===============================
// Firebase
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


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getDatabase(app);


// ===============================
// عناصر الصفحة
// ===============================

const usernameInput = document.getElementById("username");

const passwordInput = document.getElementById("password");

const createButton = document.getElementById("createAccount");

const message = document.getElementById("message");


// ===============================
// التأكد من العناصر
// ===============================

if (
    !usernameInput ||
    !passwordInput ||
    !createButton ||
    !message
) {

    console.error("لم يتم العثور على عناصر الصفحة.");

}


// ===============================
// رسالة
// ===============================

function showMessage(text, type = "") {

    message.className = type;

    message.innerHTML = text;

}


// ===============================
// رقم حساب 7 أرقام
// ===============================

function generateAccountNumber() {

    return Math.floor(
        1000000 + Math.random() * 9000000
    ).toString();

}


// ===============================
// إنشاء الحساب
// ===============================

createButton.addEventListener("click", async () => {

    const username = usernameInput.value.trim();

    const password = passwordInput.value;


    // -------------------------------
    // التحقق
    // -------------------------------

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


    // -------------------------------
    // تعطيل الزر
    // -------------------------------

    createButton.disabled = true;

    createButton.textContent = "جاري إنشاء الحساب...";

    showMessage("جاري إنشاء الحساب...", "loading");


    try {

        // -------------------------------
        // إنشاء رقم حساب
        // -------------------------------

        let accountNumber;

        let accountExists = true;

        let attempts = 0;


        while (accountExists && attempts < 10) {

            accountNumber = generateAccountNumber();

            const accountRef = ref(
                db,
                "accountNumbers/" + accountNumber
            );

            const snapshot = await get(accountRef);

            accountExists = snapshot.exists();

            attempts++;

        }


        if (accountExists) {

            throw new Error(
                "تعذر إنشاء رقم حساب جديد. حاول مرة أخرى."
            );

        }


        // -------------------------------
        // البريد الداخلي
        // -------------------------------

        const email =
            accountNumber +
            "@bok-ped.firebaseapp.com";


        // -------------------------------
        // Firebase Authentication
        // -------------------------------

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const uid =
            userCredential.user.uid;


        // -------------------------------
        // حفظ المستخدم
        // -------------------------------

        await set(
            ref(db, "users/" + uid),
            {

                username: username,

                accountNumber: accountNumber,

                uid: uid,

                createdAt: Date.now()

            }
        );


        // -------------------------------
        // حفظ رقم الحساب
        // -------------------------------

        await set(
            ref(
                db,
                "accountNumbers/" + accountNumber
            ),
            {

                uid: uid,

                username: username

            }
        );


        // -------------------------------
        // نجاح
        // -------------------------------

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

            </div>

            <p class="success-text">
                احتفظ برقم الحساب وكلمة المرور.
            </p>
            `,

            "success"
        );


        usernameInput.value = "";

        passwordInput.value = "";


    } catch (error) {

        console.error(
            "Firebase Error:",
            error
        );


        let errorMessage =
            "حدث خطأ أثناء إنشاء الحساب.";


        switch (error.code) {

            case "auth/operation-not-allowed":

                errorMessage =
                    "تسجيل الدخول بالبريد الإلكتروني غير مفعّل في Firebase Authentication.";

                break;


            case "auth/email-already-in-use":

                errorMessage =
                    "رقم الحساب مستخدم بالفعل. حاول مرة أخرى.";

                break;


            case "auth/invalid-api-key":

                errorMessage =
                    "مفتاح Firebase API غير صحيح.";

                break;


            case "auth/network-request-failed":

                errorMessage =
                    "تأكد من اتصال الإنترنت.";

                break;


            case "auth/weak-password":

                errorMessage =
                    "كلمة المرور ضعيفة.";

                break;


            case "auth/invalid-email":

                errorMessage =
                    "البريد الداخلي غير صالح.";

                break;


            case "PERMISSION_DENIED":

                errorMessage =
                    "قواعد Realtime Database تمنع حفظ البيانات.";

                break;


            default:

                errorMessage =
                    error.message ||
                    errorMessage;

                break;

        }


        showMessage(
            errorMessage,
            "error"
        );

    }


    // -------------------------------
    // إعادة الزر
    // -------------------------------

    createButton.disabled = false;

    createButton.textContent = "فتح الحساب";

});


// ===============================
// حماية النص
// ===============================

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

    // -------------------------------  
    // التحقق من كلمة المرور  
    // -------------------------------  

    if (password.length < 6) {  

        showMessage(  
            "كلمة المرور يجب أن تكون 6 أحرف على الأقل.",  
            "error"  
        );  

        return;  
    }  


    // -------------------------------  
    // تعطيل الزر  
    // -------------------------------  

    createButton.disabled = true;  

    createButton.textContent =  
        "جاري إنشاء الحساب...";  


    try {  

        // -------------------------------  
        // إنشاء رقم حساب 7 أرقام  
        // -------------------------------  

        const accountNumber =  
            generateAccountNumber();  


        // -------------------------------  
        // بريد داخلي لـ Firebase  
        // -------------------------------  

        const email =  
            accountNumber +  
            "@bok-ped.firebaseapp.com";  


        // -------------------------------  
        // إنشاء مستخدم Firebase  
        // -------------------------------  

        const userCredential =  
            await createUserWithEmailAndPassword(  
                auth,  
                email,  
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

                username:  
                    username,  

                accountNumber:  
                    accountNumber  

            }  
        );  


        // -------------------------------  
        // حفظ رقم الحساب  
        // -------------------------------  

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


        // -------------------------------  
        // إظهار النتيجة  
        // -------------------------------  

        showMessage(  

            `  
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
                احتفظ برقم الحساب وكلمة المرور.  
            </p>  
            `,  

            "success"  
        );  


        // -------------------------------  
        // تنظيف الحقول  
        // -------------------------------  

        usernameInput.value = "";  

        passwordInput.value = "";  


    } catch (error) {  

        console.error(error);  


        showMessage(  

            "حدث خطأ أثناء إنشاء الحساب:" +  
            "<br><br>" +  
            error.code +  
            "<br>" +  
            error.message,  

            "error"  
        );  

    }  


    // -------------------------------  
    // إعادة الزر  
    // -------------------------------  

    createButton.disabled = false;  

    createButton.textContent =  
        "فتح الحساب";  

}

);
