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

// ========================================
// Firebase Configuration
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

// ========================================
// تشغيل Firebase
// ========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getDatabase(app);

// ========================================
// عناصر الصفحة
// ========================================

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

// ========================================
// توليد رقم حساب من 7 أرقام
// ========================================

function generateAccountNumber() {

return Math.floor(  
    1000000 +  
    Math.random() * 9000000  
).toString();

}

// ========================================
// عرض رسالة
// ========================================

function showMessage(text, type) {

message.className = type;  

message.innerHTML = text;

}

// ========================================
// إنشاء الحساب
// ========================================

createButton.addEventListener(
"click",
async function () {

const username =  
        usernameInput.value.trim();  

    const password =  
        passwordInput.value;  

    const confirmPassword =  
        confirmPasswordInput.value;  


    // -------------------------------  
    // التحقق من اسم المستخدم  
    // -------------------------------  

    if (username.length < 3) {  

        showMessage(  
            "اسم المستخدم يجب أن يكون 3 أحرف على الأقل.",  
            "error"  
        );  

        return;  
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
    // تأكيد كلمة المرور  
    // -------------------------------  

    if (password !== confirmPassword) {  

        showMessage(  
            "كلمتا المرور غير متطابقتين.",  
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

        confirmPasswordInput.value = "";  


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
