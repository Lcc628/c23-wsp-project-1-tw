window.onload = () => {
  login();
  register();
  getGames();
  genGameModal();
};

register = () => {
  document
    .querySelector("#registerForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const username = form.username.value;
      const password = form.password.value;
      const email = form.email.value;
      const address = form.address.value;
      const phoneNum = form.phoneNum.value;

      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("email", email);
      formData.append("address", address);
      formData.append("phoneNum", phoneNum);
      formData.append("icon", form.icon.files[0]);
      const res = await fetch("/user/register", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.status == 200) {
        alert(data.message);
        window.location = "./";
      } else {
        alert(data.message);
      }
    });
};

login = () => {
  document.querySelector("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;
    console.log(username, password);
    const res = await fetch("/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ username, password }),
    });

    //admin login test
    if (res.status == "201") {
      const { message } = await res.json();
      console.log(message);
      window.location = "./admin.html";
    }
    //user
    else if (res.status == "200") {
      const { message } = await res.json();
      console.log(message);
      window.location = "./user.html";
    }
    // error
    else {
      const { message } = await res.json();
      alert(message);
    }
  });
};

getGames = async () => {
  const res = await fetch("/product/pcGames");
  data = await res.json();
  const gameListContainerDiv = document.querySelector(".gamelist-container");

  for (let game of data) {
    if (game.is_valid) {
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
    }
  }
};

genGameModal = async () => {
  let gameListContainerInnerHTML = "";

  const res = await fetch("/product/games");
  data = await res.json();

  const gameListContainerDiv = document.querySelector(".gamelist-container");

  for (let game of data) {
    gameListContainerInnerHTML += `<div class="modal fade" id="game${game.id}" tabindex="-1" aria-hidden="true">
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
            </div>
          </div>
        </div>
      </div>`;
    gameListContainerDiv.innerHTML += gameListContainerInnerHTML;
  }
  console.log(data);
};
