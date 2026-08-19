const db = firebase.firestore();

async function saveProduct() {

    const model = document.getElementById("model").value.trim();
    const supplier = document.getElementById("supplier").value.trim();

    const cartons = Number(
        document.getElementById("totalCartons").value
    ) || 0;

    const pairsPerCarton = Number(
        document.getElementById("pairsPerCarton").value
    ) || 0;

    const costPerPair = Number(
        document.getElementById("costPerPair").value
    ) || 0;

    const message = document.getElementById("message");
    const button = document.getElementById("saveProductBtn");


    // =========================
    // التحقق من البيانات
    // =========================

    if (!model) {
        alert("يرجى إدخال رقم الموديل");
        return;
    }

    if (!supplier) {
        alert("يرجى إدخال اسم المورد");
        return;
    }

    if (cartons <= 0) {
        alert("يرجى إدخال عدد الكراتين");
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


    // =========================
    // جمع الألوان
    // =========================

    const colorRows =
        document.querySelectorAll("#colors .color-row");

    const colors = [];

    let colorCartons = 0;


    colorRows.forEach(row => {

        const select = row.querySelector("select");

        const numberInput =
            row.querySelector('input[type="number"]');

        const quantityElement =
            row.querySelector(".quantity");


        const colorName =
            select ? select.value.trim() : "";


        let quantity = 0;


        // إذا كان اللون يستخدم خانة رقم
        if (numberInput) {

            quantity =
                Number(numberInput.value) || 0;

        }

        // وإذا كان يستخدم الرقم الموجود بالنص
        else if (quantityElement) {

            quantity =
                Number(quantityElement.textContent) || 0;

        }


        if (colorName) {

            colors.push({
                name: colorName,
                cartons: quantity
            });

            colorCartons += quantity;
        }

    });


    // =========================
    // التحقق من تطابق الألوان
    // =========================

    if (colors.length === 0) {

        alert("يرجى إضافة لون واحد على الأقل");

        return;
    }


    if (colorCartons !== cartons) {

        alert(
            "❌ مجموع كراتين الألوان يجب أن يساوي إجمالي عدد الكراتين\n\n" +
            "إجمالي الكراتين: " + cartons +
            "\nمجموع الألوان: " + colorCartons
        );

        return;
    }


    // =========================
    // الحسابات
    // =========================

    const totalPairs =
        cartons * pairsPerCarton;


    const totalCapital =
        totalPairs * costPerPair;


    // =========================
    // تعطيل زر الحفظ
    // =========================

    button.disabled = true;

    button.innerText =
        "⏳ جاري الحفظ...";


    try {

        // =========================
        // الحفظ في Firebase
        // =========================

        await db.collection("products").add({

            model: model,

            supplier: supplier,

            cartons: cartons,

            pairsPerCarton: pairsPerCarton,

            costPerPair: costPerPair,

            totalPairs: totalPairs,

            totalCapital: totalCapital,

            colors: colors,

            createdAt:
                firebase.firestore.FieldValue.serverTimestamp()

        });


        // =========================
        // رسالة نجاح
        // =========================

        message.innerText =
            "✅ تم حفظ الموديل بنجاح";

        message.style.color =
            "#38d66b";


        // =========================
        // تنظيف البيانات
        // =========================

        document.getElementById("model").value = "";

        document.getElementById("supplier").value = "";

        document.getElementById("totalCartons").value = "";

        document.getElementById("pairsPerCarton").value = "";

        document.getElementById("costPerPair").value = "";


        // إعادة الألوان
        document.getElementById("colors").innerHTML = "";


        // إضافة لون جديد فارغ
        if (typeof addColor === "function") {

            addColor();

        }


        // تحديث الحسابات
        if (typeof calculate === "function") {

            calculate();

        }


    } catch (error) {

        console.error(
            "Firebase Error:",
            error
        );


        message.innerText =
            "❌ حدث خطأ أثناء الحفظ";

        message.style.color =
            "red";


        alert(
            "خطأ في الحفظ:\n" +
            error.message
        );

    } finally {

        button.disabled = false;

        button.innerText =
            "💾 حفظ الموديل";

    }

}