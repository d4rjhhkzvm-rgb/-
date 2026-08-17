const provider = new firebase.auth.GoogleAuthProvider();

window.loginGoogle = function(){

    firebase.auth()
    .signInWithPopup(provider)
    .then((result)=>{

        const user = result.user;

        localStorage.setItem("userName", user.displayName);
        localStorage.setItem("userEmail", user.email);

        window.location.href = "dashboard.html";

    })
    .catch((error)=>{

        console.log(error);
        alert(error.message);

    });

};


firebase.auth().onAuthStateChanged((user)=>{

    if(user){

        console.log("User:", user.email);

    }

});