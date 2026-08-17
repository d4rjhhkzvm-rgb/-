function saveProduct(){

    let model = document.getElementById("model").value;
    let supplier = document.getElementById("supplier").value;
    let color = document.getElementById("color").value;
    let cartons = Number(document.getElementById("cartons").value);


    if(!model || !color || !cartons){

        alert("يرجى تعبئة المعلومات");
        return;

    }


    db.collection("products").add({

        model: model,
        supplier: supplier,
        color: color,
        cartons: cartons,
        date: new Date()

    })
    .then(()=>{

        alert("تم حفظ الموديل بنجاح");


        document.getElementById("model").value="";
        document.getElementById("supplier").value="";
        document.getElementById("color").value="";
        document.getElementById("cartons").value="";

    })

    .catch((error)=>{

        alert(error.message);

    });

}