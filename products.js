const db = firebase.firestore();
async function saveProduct() {
    const model = document.getElementById("model").value.trim();
    const supplier = document.getElementById("supplier").value.trim();
    const cartonsInput = document.getElementById("cartons").value;
    const pairsPerCartonInput = document.getElementById("pairsPerCarton").value;
    const costPerPairInput = document.getElementById("costPerPair").value;
    const cartons = Number(cartonsInput);
    const pairsPerCarton = Number(pairsPerCartonInput);
    const costPerPair = Number(costPerPairInput);
    const message = document.getElementById("message");
    const button = document.getElementById("saveProductBtn");
    // التحقق من البيانات الأساسية
    if (!model) {
        alert("يرجى إدخال رقم الموديل");
        return;
    }
    if (!supplier) {
        alert("يرجى إدخال اسم المورد");
        return;
    }
    if (!cartons || cartons < 0) {
        alert("يرجى إدخال عدد الكراتين");
        return;
    }
    if (!pairsPerCarton || pairsPerCarton <= 0) {
        alert("يرجى إدخال عدد الأزواج داخل الكرتونة");
        return;
    }
    if (costPerPair < 0) {
        alert("يرجى إدخال سعر صحيح");
        return;
    }
    // جمع الألوان
    const colorRows = document.querySelectorAll("#colors .color-row");
    const colors = [];
    colorRows.forEach((row) => {
        const select = row.querySelector("select");
        const input = row.querySelector("input");
        const colorName = select ? select.value.trim() : "";
        const colorCartons = input ? Number(input.value) : 0;
        if (colorName && colorCartons >= 0) {
            colors.push({
                name: colorName,
                cartons: colorCartons
            });
        }
    });
    // منع حفظ الموديل بدون لون
    if (colors.length === 0) {
        alert("يرجى إضافة لون واحد على الأقل");
        return;
    }
    // حساب عدد الأزواج
    const totalPairs = cartons * pairsPerCarton;
    // حساب رأس المال
    const totalCapital = totalPairs * costPerPair;
    // تعطيل الزر أثناء الحفظ
    button.disabled = true;
    button.innerText = "⏳ جاري الحفظ...";
    try {
        await db.collection("products").add({
            model: model,
            supplier: supplier,
            cartons: cartons,
            pairsPerCarton: pairsPerCarton,
            costPerPair: costPerPair,
            totalPairs: totalPairs,
            totalCapital: totalCapital,
            colors: colors,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        message.innerText = "✅ تم حفظ الموديل بنجاح";
        message.style.color = "#d4af37";
        // تنظيف النموذج بعد الحفظ
        document.getElementById("model").value = "";
        document.getElementById("supplier").value = "";
        document.getElementById("cartons").value = "";
        document.getElementById("pairsPerCarton").value = "";
        document.getElementById("costPerPair").value = "";
        // إعادة الألوان إلى لون واحد فارغ
        const colorsContainer = document.getElementById("colors");
        colorsContainer.innerHTML = `
            <div class="color-row">
                <select>
                    <option value="">اختر اللون</option>
                    <option>أسود</option>
                    <option>بني</option>
                    <option>عسلي</option>
                    <option>موغا</option>
                    <option>أبيض</option>
                    <option>بيج</option>
                    <option>كحلي</option>
                    <option>رمادي</option>
                </select>
                <input
                    type="number"
                    min="0"
                    placeholder="عدد الكراتين">
            </div>
        `;
    } catch (error) {
        console.error("Firebase Error:", error);
        message.innerText = "❌ حدث خطأ أثناء الحفظ";
        message.style.color = "red";
        alert(error.message);
    } finally {
        button.disabled = false;
        button.innerText = "💾 حفظ الموديل";
    }
}
