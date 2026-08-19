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

    // مهم: هذه هي الـ IDs الموجودة فعلياً في HTML
    const message = document.getElementById("saveMessage");
    const button = document.querySelector(".save-btn");


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

        const select =
            row.querySelector("select");

        const input =
            row.querySelector(".quantity");


        const colorName =
            select ? select.value.trim() : "";


        const quantity =
            input ? Number(input.value) || 0 : 0;


        // إذا اللون مختار أو الكمية موجودة
        if (colorName) {

            colors.push({
                name: colorName,
                cartons: quantity
            });

            colorCartons += quantity;
        }

    });


    // =========================
    // لازم يكون في لون
    // =========================

    if (colors.length === 0) {

        alert("يرجى إضافة لون واحد على الأقل");

        return;
    }


    // =========================
    // مطابقة الكراتين
    // =========================

    if (colorCartons !== cartons) {

        alert(
            "❌ لا يمكن الحفظ\n\n" +
            "إجمالي الكراتين: " + cartons +
            "\nمجموع كراتين الألوان: " + colorCartons +
            "\n\nيجب أن يكون الرقمين متساويين."
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

    if (button) {

        button.disabled = true;
        button.innerText = "⏳ جاري الحفظ...";

    }


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

            colorCartons: colorCartons,

            colors: colors,

            createdAt:
                firebase.firestore.FieldValue.serverTimestamp()

        });


        // =========================
        // رسالة نجاح
        // =========================

        if (message) {

            message.innerText =
                "✅ تم حفظ الموديل بنجاح";

            message.style.color =
                "#38d66b";

        }


        alert("✅ تم حفظ الموديل بنجاح");


        // =========================
        // تنظيف البيانات
        // =========================

        document.getElementById("model").value = "";

        document.getElementById("supplier").value = "";

        document.getElementById("totalCartons").value = "";

        document.getElementById("pairsPerCarton").value = "";

        document.getElementById("costPerPair").value = "";


        // =========================
        // تنظيف الألوان
        // =========================

        document.getElementById("colors").innerHTML = "";


        // إضافة لون فارغ جديد
        if (typeof addColor === "function") {

            addColor();

        }


        // =========================
        // إعادة الحساب
        // =========================

        if (typeof calculate === "function") {

            calculate();

        }

    }

    catch (error) {

        console.error(
            "Firebase Error:",
            error
        );


        if (message) {

            message.innerText =
                "❌ حدث خطأ أثناء الحفظ";

            message.style.color =
                "#ff4d4d";

        }


        alert(
            "❌ حدث خطأ أثناء الحفظ:\n\n" +
            error.message
        );

    }

    finally {

        if (button) {

            button.disabled = false;

            button.innerText =
                "💾 حفظ الموديل";

        }

    }

}