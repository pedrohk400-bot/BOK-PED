// ======================================================
// ADMIN LOGIN - BOK PEDRO
// Firebase Project: bok-pedro-new
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

    // التحقق من وجود الحقول

    if (!emailInput || !passwordInput) {

        showMessage(
            "خطأ: لم يتم العثور على حقول تسجيل الدخول في الصفحة."
        );

        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // التحقق من المدخلات

    if (!email || !password) {

        showMessage(
            "أدخل البريد الإلكتروني وكلمة المرور."
        );

        return;
    }

    // تعطيل زر الدخول أثناء المحاولة

    const loginButton = getElement(
        "loginButton",
        "adminLoginButton",
        "loginBtn"
    );

    if (loginButton) {
        loginButton.disabled = true;
    }

    try {

        // التحقق من إعدادات المشروع

        if (
            !firebaseConfig ||
            firebaseConfig.projectId !== "bok-pedro-new"
        ) {

            throw new Error(
                "إعدادات مشروع Firebase غير صحيحة."
            );
        }

        // تسجيل الدخول

        const result = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = result.user;

        // التحقق من هوية المدير

        if (
            user.uid !== ADMIN_UID ||
            user.email !== ADMIN_EMAIL
        ) {

            await signOut(auth);

            showMessage(
                "هذا الحساب غير مصرح له بدخول لوحة الإدارة."
            );

            return;
        }

        // تحديث رمز المصادقة

        await user.getIdToken(true);

        // عرض لوحة الإدارة

        showAdminPanel();

        showMessage(
            "تم تسجيل الدخول بنجاح."
        );

    } catch (error) {

        console.error(
            "BOK PEDRO Login Error:",
            error.code || "",
            error.message || error
        );

        const errorCode = error.code || "";

        let message = "";

        switch (errorCode) {

            case "auth/invalid-credential":
            case "auth/invalid-login-credentials":

                message =
                    "البريد الإلكتروني أو كلمة المرور غير صحيحة. " +
                    "تأكد من بيانات الحساب.";

                break;

            case "auth/user-not-found":

                message =
                    "حساب المدير غير موجود في Firebase Authentication.";

                break;

            case "auth/wrong-password":

                message =
                    "كلمة المرور غير صحيحة.";

                break;

            case "auth/invalid-email":

                message =
                    "صيغة البريد الإلكتروني غير صحيحة.";

                break;

            case "auth/user-disabled":

                message =
                    "حساب المدير معطّل في Firebase.";

                break;

            case "auth/too-many-requests":

                message =
                    "محاولات تسجيل دخول كثيرة. انتظر قليلًا ثم حاول مجددًا.";

                break;

            case "auth/network-request-failed":

                message =
                    "فشل الاتصال بخوادم Firebase. تحقق من الإنترنت.";

                break;

            case "auth/operation-not-allowed":

                message =
                    "فعّل تسجيل الدخول باستخدام Email/Password " +
                    "من إعدادات Firebase Authentication.";

                break;

            case "auth/unauthorized-domain":

                message =
                    "اسم النطاق الذي يستضيف الموقع غير مسموح به. " +
                    "أضفه إلى Authorized domains في Firebase Authentication.";

                break;

            case "auth/invalid-api-key":

                message =
                    "مفتاح Firebase API غير صالح. راجع إعدادات المشروع.";

                break;

            case "auth/app-not-authorized":

                message =
                    "تطبيق الويب غير مخوّل لاستخدام مشروع Firebase.";

                break;

            case "auth/requests-from-referer-blocked":

                message =
                    "تم رفض الطلب بسبب قيود مفتاح API أو عنوان الموقع.";

                break;

            default:

                message =
                    "رمز الخطأ: " +
                    errorCode +
                    "\nالتفاصيل: " +
                    (error.message || "خطأ غير معروف");

                break;
        }

        showMessage(message);

    } finally {

        if (loginButton) {
            loginButton.disabled = false;
        }

    }
}
