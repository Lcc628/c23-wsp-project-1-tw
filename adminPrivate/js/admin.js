window.onload = async () => {
  await getGames();
  await genGameModal();
  await getUserInfo();
  await logout();
  await clearCart();
};

logout = async () => {
  document.querySelector("#logOutBtn").addEventListener("click", async (e) => {
    console.log("click");
    const res = await fetch("/user/logout");
    data = await res.json();
    console.log(data);
    if ((data.status = "200")) {
      alert("Logged out");
      window.location = "./";
    }
  });
};

getUserInfo = async () => {
  const res = await fetch("/user/loginUserInfo");
  data = await res.json();
  // const userName = document.querySelector("#userName");
  // userName.innerText = `username: ${data.username}`;
};

getGames = async () => {
  const res = await fetch("/product/games");
  data = await res.json();

  const gameListContainerDiv = document.querySelector(".gamelist-container");

  for (let game of data) {
    const gameLsDiv = document.createElement("div");
    const imgElement = document.createElement("img");
    const desDiv = document.createElement("div");
    const consoleElement = document.createElement("span");
    const nameElement = document.createElement("h5");
    const priceElement = document.createElement("h5");

    gameLsDiv.className = "game-ls";
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
    
    if(!game.is_valid){
      gameLsDiv.className = "game-ls opacity-25";
    }
  }
  console.log(data);
};

genGameModal = async () => {
  const res = await fetch("/product/games");
  data = await res.json();
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
                <div class="col-md-6">
                <div class="row gap-5">
                <span class="fs-3">${game.name}</span>
                <span class="text-start">售價: ${game.price}</span>
                <span class="text-start">遊戲機: ${game.console}</span>
                <span class="text-start shadow p-3 mb-5 bg-body rounded">遊戲介紹: ${game.description}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
                <button class='btn deletegame-button' data-id=${game.id}>HIDE</button>
                <button class='btn displayGame-button' data-id=${game.id}>DISPLAY</button> 
            </div>
          </div>
        </div>
      </div>
      `;
    gameListContainerDiv.innerHTML += gameListContainerInnerHTML;
 
  }
  addToCart();
  delGame();
  displayGame();
};

function displayGame() {
  const delGameButton = document.querySelectorAll(".displayGame-button");
  delGameButton.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const gameId = e.target.dataset.id;

      // req.params
      const url = `/product/displayGame/${gameId}`;
      const respJson = await fetch(url);
      const resp = await respJson.json();
      console.log("servers response: ", resp);
      if (respJson.status === 200) {
        alert("displayed successfully.");
        window.location = "./admin.html"
      } else {
        alert("Unable to display.");
      }
    });
  });
}

function delGame() {
  const delGameButton = document.querySelectorAll(".deletegame-button");
  delGameButton.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const gameId = e.target.dataset.id;
      // req.query
      // const url = `/product/delgame?gameid=${gameId}`

      // req.params
      const url = `/product/delgame/${gameId}`;
      const respJson = await fetch(url);
      const resp = await respJson.json();
      console.log("servers response: ", resp);
      if (respJson.status === 200) {
        alert("Deleted successfully.");
        window.location = "./admin.html"
      } else {
        alert("Unable to delete.");
      }
    });
  });
}

addToCart = () => {
  const gameCartDiv = document.querySelector("#gameCart");

  document.querySelectorAll(".add-to-cart-button").forEach((e) => {
    e.addEventListener("click", async (e) => {
      gameCartDiv.innerHTML = "";
      const addBtn = e.target;
      // const id = addBtn.id.split("-")[1];
      const id = addBtn.dataset.id;
      console.log("click: ", id);

      const res = await fetch(`/product/games/${id}`);
      const data = await res.json();
      if ((res.status = "200")) {
        alert("add item success");
      }
      console.log(data);

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
        infoColDiv.className = "col-md-4";
        infoColDiv.appendChild(gameInfoDiv);

        const imgDiv = document.createElement("img");
        imgDiv.className = "col-md-3";
        imgDiv.src = `${game.image}`;

        const gamesDivRow = document.createElement("div");
        gamesDivRow.className = "row";
        gamesDivRow.appendChild(imgDiv);
        gamesDivRow.appendChild(infoColDiv);

        gameCartDiv.appendChild(gamesDivRow);
      }
    });
  });
};

clearCart = () => {
  document.querySelector("#clearBtn").addEventListener("click", async (e) => {
    const res = await fetch("/product/clearCart");

    data = await res.json();
    console.log(data);
    const cartContent = document.querySelector("#gameCart");
    cartContent.innerHTML = "";
    if (res.status == "200") {
      alert("clear success");
    }
  });
};
