const shoes = JSON.parse(localStorage.getItem("shoes") || "[]");

function add() {
  const shoe = {
    model: document.getElementById("model").value,
    supplier: document.getElementById("supplier").value,
    color: document.getElementById("color").value,
    qty: document.getElementById("qty").value
  };

  shoes.push(shoe);
  localStorage.setItem("shoes", JSON.stringify(shoes));
  show();
}

function show() {
  let html = "";

  shoes.forEach((shoe) => {
    html += `
      <div class="item">
        <b>الموديل:</b> ${shoe.model}<br>
        <b>المورد:</b> ${shoe.supplier}<br>
        <b>اللون:</b> ${shoe.color}<br>
        <b>الكراتين:</b> ${shoe.qty}
      </div>
    `;
  });

  document.getElementById("list").innerHTML = html;
}

show();
