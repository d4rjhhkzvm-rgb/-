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


    // =========================
    // التحقق
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


    // =========================
    // جمع الألوان
    // =========================

    const rows =
        document.querySelectorAll(
            "#colors .color-row"
        );

    const colors = [];

    let colorCartons = 0;


    rows.forEach(row => {

        const select =
            row.querySelector("select");

        const colorName =
            select
                ? select.value.trim()
                : "";


        // يدعم خانة الرقم الجديدة
        const numberInput =
            row.querySelector(
                ".quantity-input, input[type='number']"
            );


        // ويدعم الشكل القديم
        const quantityElement =
            row.querySelector(".quantity");


        let quantity = 0;


        if (numberInput) {

            quantity =
                Number(numberInput.value) || 0;

        } else if (quantityElement) {

            quantity =
                Number(quantityElement.value) ||
                Number(quantityElement.textContent) ||
                0;

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
    // التحقق من مجموع الألوان
    // =========================

    if (colors.length === 0) {

        alert(
            "يرجى إضافة لون واحد على الأقل"
        );

        return;
    }


    if (colorCartons !== cartons) {

        alert(
            "❌ مجموع كراتين الألوان لا يساوي إجمالي الكراتين.\n\n" +
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
    // بدء الحفظ
    // =========================

    if (button) {

        button.disabled = true;

        button.innerText =
            "⏳ جاري الحفظ...";

    }


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


        // =========================
        // نجاح
        // =========================

        if (message) {

            message.textContent =
                "✅ تم حفظ الموديل بنجاح";

            message.style.color =
                "#38d66b";

        }


        alert("✅ تم حفظ الموديل بنجاح");


        // تنظيف الحقول

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


        // تنظيف الألوان

        document.getElementById(
            "colors"
        ).innerHTML = "";


        // إضافة لون جديد

        if (typeof addColor === "function") {

            addColor();

        }


        // إعادة الحساب

        if (typeof calculate === "function") {

            calculate();

        }


    } catch (error) {

        console.error(
            "Firebase Error:",
            error
        );


        if (message) {

            message.textContent =
                "❌ فشل الحفظ";

            message.style.color =
                "red";

        }


        alert(
            "❌ فشل الحفظ:\n\n" +
            error.message
        );


    } finally {

        if (button) {

            button.disabled = false;

            button.innerText =
                "💾 حفظ الموديل";

        }

    }

}