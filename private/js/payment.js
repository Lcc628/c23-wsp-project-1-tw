window.onload = async () => {
  await inputUserInfoAuto();
  await getCartInfo();
  await createTransaction();
  await createChangeAddressButton();
};

inputUserInfoAuto = async () => {
  const res = await fetch("/user/loginUserInfo");
  data = await res.json();
  console.log(data);
  //payment
  document.querySelector("#username").value = data.username;
  document.querySelector("#email").value = data.email;
  document.querySelector("#address").value = data.address;

  // transaction
  document.querySelector(
    "#nameOfUser"
  ).innerText = `User Name: ${data.username}`;
};

getCartInfo = async () => {
  const cartProductList = document.querySelector("#cartProductList");
  const res = await fetch("/product/getCartInfo");
  data = await res.json();
  console.log("cart data: ", data);
  let cartProductHTML = ``;
  let totalPrice = 0;

  document.querySelector("#numOfGame").innerText = `${data.length}`;

  //transaction price
  const itemsPrice = document.querySelector("#itemsNamePrice");
  let itemsPriceHTML = "";

  for (let cartProduct of data) {
    totalPrice += parseInt(cartProduct.price);
    cartProductHTML += `<li class="list-group-item d-flex justify-content-between lh-sm">
        <div>
          <h6 class="my-0">${cartProduct.name}</h6>
          <small class="text-muted">${cartProduct.game_cate}</small>
        </div>
        <span class="text-muted">$${cartProduct.price}</span>
      </li>`;

    //transaction
    itemsPriceHTML += `<tr>
      <td >${cartProduct.name}</td>
      <td class="alignright">$ ${cartProduct.price}</td>
  </tr>`;
  }
  let totalPriceHTML = `<li class="list-group-item d-flex justify-content-between">
    <span>Total (HKD)</span>
    <strong>$${totalPrice.toFixed(2)}</strong>
  </li>`;
  cartProductList.innerHTML = cartProductHTML + totalPriceHTML;

  //transaction total price html
  itemsPrice.innerHTML = itemsPriceHTML + totalPriceHTML;
};

createTransaction = async () => {
  document
    .querySelector("#transactionBtn")
    .addEventListener("click", async (e) => {
      const res = await fetch("/product/transactionDetail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          username: document.querySelector("#username").value,
          email: document.querySelector("#email").value,
          address: document.querySelector("#address").value,
          // paymentMethod: document.querySelector('').value,
        }),
      });
      data = await res.json();
      console.log("transaction: ", data.transactionRecord);

      if (res.status == "200") {
        // document.querySelector("#nameOfUser").innerText = data.
        if (data.transactionRecord.length == 0) {
          alert("no products");
          return;
        }

        const transactionDate =
          data.transactionRecord[0].created_at.split("T")[0];

        document.querySelector(
          "#transactionDate"
        ).innerText = `Date: ${transactionDate}`;
        document.querySelector(
          "#newAddress"
        ).innerText = `Address: ${data.transactionRecord[0].address}`;
        document.querySelector(
          "#newEmail"
        ).innerText = `email: ${data.transactionRecord[0].email}`;

        document.querySelector("#receipt").style.display = "block";
        document.querySelector("#check_out_from").style.display = "none";
      }
    });
};

createChangeAddressButton = () => {
  document.querySelector("#changeAddress").addEventListener("click", (e) => {
    document.querySelector("#address").removeAttribute("disabled");
    document.querySelector("#email").removeAttribute("disabled");
  });
};
