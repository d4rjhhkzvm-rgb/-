const db = firebase.firestore();

async function saveProduct() {

    const model =
        document.getElementById("model").value.trim();

    const supplier =
        document.getElementById("supplier").value.trim();

    const cartons =
        Number(
            document.getElementById("totalCartons").value
        ) || 0;

    const pairsPerCarton =
        Number(
            document.getElementById("pairsPerCarton").value
        ) || 0;

    const costPerPair =
        Number(
            document.getElementById("costPerPair").value
        ) || 0;

    const message =
        document.getElementById("saveMessage");

    const button =
        document.querySelector(".save-btn");


    /* =========================
       التحقق من البيانات
    ========================= */

    if (!model) {
        alert("يرجى إدخال رقم الموديل");
        return;
    }

    if (!supplier) {
        alert("يرجى إدخال اسم المورد");
        return;
    }

    if (cartons <= 0) {
        alert("يرجى إدخال إجمالي عدد الكراتين");
        return;
    }

    if (pairsPerCarton <= 0) {
        alert("يرجى إدخال عدد الأزواج داخل الكرتونة");
        return;
    }

    if (costPerPair < 0) {
        alert("يرجى إدخال سعر صحيح");
        return;
    }


    /* =========================
       جمع الألوان
    ========================= */

    const colorRows =
        document.querySelectorAll(
            "#colors .color-row"
        );

    const colors = [];

    let colorCartons = 0;


    colorRows.forEach(row => {

        const select =
            row.querySelector("select");

        const input =
            row.querySelector(".quantity");

        const colorName =
            select
                ? select.value.trim()
                : "";

        const quantity =
            input
                ? Number(input.value) || 0
                : 0;


        if (colorName) {

            colors.push({
                name: colorName,
                cartons: quantity
            });

            colorCartons += quantity;

        }

    });


    /* =========================
       التحقق من الألوان
    ========================= */

    if (colors.length === 0) {

        alert(
            "يرجى إضافة لون واحد على الأقل"
        );

        return;
    }


    if (colorCartons !== cartons) {

        alert(
            "لا يمكن الحفظ لأن مجموع كراتين الألوان لا يساوي إجمالي الكراتين."
        );

        return;
    }


    /* =========================
       الحسابات
    ========================= */

    const totalPairs =
        cartons * pairsPerCarton;


    const totalCapital =
        totalPairs * costPerPair;


    /* =========================
       تعطيل زر الحفظ
    ========================= */

    button.disabled = true;

    button.innerText =
        "⏳ جاري الحفظ...";


    try {

        await db
            .collection("products")
            .add({

                model: model,

                supplier: supplier,

                cartons: cartons,

                colors: colors,

                pairsPerCarton:
                    pairsPerCarton,

                costPerPair:
                    costPerPair,

                totalPairs:
                    totalPairs,

                totalCapital:
                    totalCapital,

                createdAt:
                    firebase.firestore
                    .FieldValue
                    .serverTimestamp()

            });


        /* =========================
           نجاح الحفظ
        ========================= */

        message.innerText =
            "✅ تم حفظ الموديل بنجاح";

        message.style.color =
            "#38d66b";


        /* تنظيف البيانات */

        document.getElementById(
            "model"
        ).value = "";


        document.getElementById(
            "supplier"
        ).value = "";


        document.getElementById(
            "totalCartons"
        ).value = "";


        document.getElementById(
            "pairsPerCarton"
        ).value = "";


        document.getElementById(
            "costPerPair"
        ).value = "";


        /* تنظيف الألوان */

        document.getElementById(
            "colors"
        ).innerHTML = "";


        /* إضافة لون جديد فارغ */

        addColor();


        /* إعادة الحساب */

        calculate();


        /* تنظيف رسالة الحفظ بعد فترة */

        setTimeout(() => {

            message.innerText = "";

        }, 4000);


    } catch (error) {

        console.error(
            "Firebase Error:",
            error
        );


        message.innerText =
            "❌ حدث خطأ أثناء الحفظ";

        message.style.color =
            "#ff4444";


        alert(
            "خطأ أثناء الحفظ:\n" +
            error.message
        );


    } finally {

        button.disabled = false;

        button.innerText =
            "💾 حفظ الموديل";

    }

}