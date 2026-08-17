// Google Login

const provider = new firebase.auth.GoogleAuthProvider();


function loginGoogle(){

firebase.auth()
.signInWithPopup(provider)

.then((result)=>{

const user = result.user;


localStorage.setItem(
"userName",
user.displayName
);


localStorage.setItem(
"userEmail",
user.email
);


// الذهاب للوحة التحكم

window.location.href="dashboard.html";


})

.catch((error)=>{

alert("خطأ في تسجيل الدخول: " + error.message);

});


}


// حماية لوحة التحكم

firebase.auth().onAuthStateChanged((user)=>{


if(!user){

if(window.location.pathname.includes("dashboard")){

window.location.href="index.html";

}

}


});



// تسجيل الخروج

function logout(){

firebase.auth()
.signOut()
.then(()=>{


localStorage.clear();

window.location.href="index.html";


});


}