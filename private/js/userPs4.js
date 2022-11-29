window.onload = async () => {
  await getGames();
  await genGameModal();
  await getUserInfo();
  // await addToCart();
  await getCart();
  await logout();
  await clearCart();
  await checkCart();
};

logout = async () => {
  document.querySelector("#logOutBtn").addEventListener("click", async (e) => {
    console.log("click");
    const res = await fetch("/user/logout");
    const data = await res.json();
    console.log(data);
    if ((data.status = "200")) {
      alert("Logged out");
      window.location = "./";
    }
  });
};

getUserInfo = async () => {
  const res = await fetch("/user/loginUserInfo");
  const data = await res.json();
  const userName = document.querySelector("#userName");
  userName.innerText = `username: ${data.username}`;
};

getGames = async () => {
  const res = await fetch("/product/ps4Games");
  const data = await res.json();

  const gameListContainerDiv = document.querySelector(".gamelist-container");

  for (let game of data) {
    if (game.is_valid) {
      const gameLsDiv = document.createElement("div");
      const imgElement = document.createElement("img");
      const desDiv = document.createElement("div");
      const consoleElement = document.createElement("span");
      const nameElement = document.createElement("h5");
      const priceElement = document.createElement("h5");

      gameLsDiv.classList.add("game-ls");
      gameLsDiv.setAttribute("draggable", "true");
      gameLsDiv.setAttribute("data-id", game.id);
      gameLsDiv.dataset.bsToggle = "modal";

      gameLsDiv.dataset.bsTarget = `#game${game.id}`;

      imgElement.src = "./" + game.image;
      desDiv.className = "des";
      consoleElement.innerText = game.console;
      nameElement.innerText = game.name;
      priceElement.innerText = `$${game.price}`;

      desDiv.appendChild(consoleElement);
      desDiv.appendChild(nameElement);
      gameLsDiv.appendChild(imgElement);
      gameLsDiv.appendChild(desDiv);
      gameLsDiv.appendChild(priceElement);

      gameListContainerDiv.appendChild(gameLsDiv);
    }
    document.querySelectorAll(".game-ls").forEach((elem) =>
      elem.addEventListener("drag", (e) => {
        e.preventDefault();
        console.log("dragging: ", e.target);
      })
    );
  }
  console.log("games displayed", data);
};

genGameModal = async () => {
  const res = await fetch("/product/games");
  const data = await res.json();
  let gameListContainerInnerHTML = "";

  const gameListContainerDiv = document.querySelector(".gamelist-container");

  for (let game of data) {
    gameListContainerInnerHTML += `
        <div class="modal fade" id="game${game.id}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <img class="col-md-6" src="./${game.image}">
                <div class="col-md-5">
                  <div class="row gap-5">
                  <span class="fs-3">${game.name}</span>
                  <span class="text-start shadow p-3 mb-5 bg-body rounded">售價: ${game.price}</span>
                  <span class="text-start shadow p-3 mb-5 bg-body rounded">遊戲機: ${game.console}</span>
                  <span class="text-start shadow p-3 mb-5 bg-body rounded">遊戲介紹: ${game.description}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
                <button class='btn add-to-cart-button' data-id=${game.id}>ADD TO CART</button>
            </div>
          </div>
        </div>
      </div>
      `;
    gameListContainerDiv.innerHTML += gameListContainerInnerHTML;
  }
  addToCart();
};

/////////////////////Cart routes////////////////////

getCart = async () => {
  const gameCartDiv = document.querySelector("#gameCart");
  const cartBtn = document.querySelector(".shopping-cart");

  cartBtn.addEventListener("click", async (e) => {
    console.log("clicked gameCart");

    const res = await fetch(`/product/getCartInfo`);
    const data = await res.json();
    console.log("newCartData: ", data);
    gameCartDiv.innerHTML = "";
    for (let game of data) {
      const nameSpan = document.createElement("span");
      const priceSpan = document.createElement("span");
      nameSpan.innerText = `name: ${game.name}`;
      priceSpan.innerText = `price: ${game.price}`;

      const gameInfoDiv = document.createElement("div");
      gameInfoDiv.className = "row";
      gameInfoDiv.appendChild(nameSpan);
      gameInfoDiv.appendChild(priceSpan);

      const infoColDiv = document.createElement("div");
      infoColDiv.className = "col-md-8";
      infoColDiv.appendChild(gameInfoDiv);

      const imgDiv = document.createElement("img");
      imgDiv.className = "col-md-4";
      imgDiv.src = `${game.image}`;

      const gamesDivRow = document.createElement("div");
      gamesDivRow.className = "row";
      gamesDivRow.appendChild(imgDiv);
      gamesDivRow.appendChild(infoColDiv);

      gameCartDiv.appendChild(gamesDivRow);
    }
  });
};

addToCart = () => {
  document.querySelectorAll(".add-to-cart-button").forEach((e) => {
    e.addEventListener("click", async (e) => {
      const addBtn = e.target;
      const id = addBtn.dataset.id;
      console.log("click: ", id);
      const res = await fetch(`/product/games/${id}`);
      const data = await res.json();
      if ((res.status = "200")) {
        alert("add item success");
      }
    });
  });
};

clearCart = () => {
  document.querySelector("#clearBtn").addEventListener("click", async (e) => {
    const res = await fetch("/product/clearCart");

    const data = await res.json();
    console.log(data);
    const cartContent = document.querySelector("#gameCart");
    cartContent.innerHTML = "";
    if (res.status == "200") {
      alert("clear success");
    }
  });
};

checkCart = () => {
  document.querySelector("#pay-btn").addEventListener("click", async (e) => {
    const res = await fetch(`/product/getCartInfo`);
    const data = await res.json();
    if (data.length == 0) {
      alert("no products");
    } else {
      window.location = "./payment.html";
    }
  });
};
