window.onload = async () => {
    await inputUserInfoAuto();
    await getCartInfo();
    // await transactionBtn();
}

inputUserInfoAuto = async () => {
    const res = await fetch('/loginUserInfo');
    data = await res.json();
    console.log(data)
    document.querySelector("#username").value = data.username;
    document.querySelector('#email').value = data.email;
    document.querySelector('#address').value = data.address;
}

getCartInfo = async () => {
    const cartProductList = document.querySelector("#cartProductList");
    const res = await fetch('/getCartInfo');
    data = await res.json();
    console.log(data)
    let cartProductHTML = ``;
    let totalPrice = 0;


    for (let cartProduct of data) {
        totalPrice += parseInt(cartProduct.price);
        cartProductHTML += `<li class="list-group-item d-flex justify-content-between lh-sm">
        <div>
          <h6 class="my-0">${cartProduct.name}</h6>
          <small class="text-muted">${cartProduct.game_cate}</small>
        </div>
        <span class="text-muted">$${cartProduct.price}</span>
      </li>`
    }
    let totalPriceHTML = `<li class="list-group-item d-flex justify-content-between">
    <span>Total (HKD)</span>
    <strong>$${totalPrice.toFixed(2)}</strong>
  </li>`
    cartProductList.innerHTML = cartProductHTML + totalPriceHTML
}

// transactionBtn = () => {
//     // let totalPrice = 0;
//     // const res = await fetch('/getCartInfo');
//     // data = await res.json();
//     // for(let cartProduct of data){
//     //     totalPrice += parseInt(cartProduct.price);
//     // }
//     // console.log("totalPrice: ",totalPrice)
//     // document.querySelector("#transactionBtn").addEventListener("click",async (e)=>{
//     //     const res = await fetch('/getCartInfo');
//     //     data = await res.json();

//     //     window.location = "./transaction.html"
//     // )
//     // }
//     document.querySelector("#transactionBtn").addEventListener("click", async(e) => {
//         const res = await fetch('/transaction');
//         data = await res.json();
//         console.log("games : ",data)
//         window.location = "./transaction.html"
//     })
// }