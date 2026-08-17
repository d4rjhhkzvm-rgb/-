import { auth } from "./firebase-config.js";

import {
GoogleAuthProvider,
signInWithPopup,
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const provider = new GoogleAuthProvider();


// تسجيل الدخول بجوجل
window.loginGoogle = function(){

signInWithPopup(auth, provider)

.then((result)=>{

const user = result.user;


// حفظ بيانات المستخدم
localStorage.setItem(
"userName",
user.displayName
);

localStorage.setItem(
"userEmail",
user.email
);


// الانتقال للوحة التحكم
window.location.href="dashboard.html";


})


.catch((error)=>{

alert("فشل تسجيل الدخول: "+error.message);

});


};



// حماية الصفحات
onAuthStateChanged(auth,(user)=>{

if(!user){

if(
window.location.pathname.includes("dashboard")
){

window.location.href="index.html";

}

}

});



// تسجيل الخروج
window.logout=function(){

signOut(auth).then(()=>{

localStorage.clear();

window.location.href="index.html";

});

};
