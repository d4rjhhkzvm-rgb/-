// CENTER ALBAZIKI Authentication

const provider = new firebase.auth.GoogleAuthProvider();


// تسجيل الدخول بواسطة Google
function loginGoogle() {

    auth.signInWithPopup(provider)
    .then((result) => {

        const user = result.user;

        // حفظ بيانات المستخدم في Firestore
        db.collection("users").doc(user.uid).set({

            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            lastLogin: new Date()

        }, { merge: true });


        // الانتقال للوحة التحكم
        window.location.href = "dashboard.html";


    })
    .catch((error) => {

        console.log(error);

        alert("حدث خطأ في تسجيل الدخول");

    });

}



// مراقبة حالة الدخول
auth.onAuthStateChanged((user)=>{

    const page = window.location.pathname;


    if(!user && page.includes("dashboard")){

        window.location.href = "index.html";

    }


});