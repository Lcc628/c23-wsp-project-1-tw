window.onload = async () => {
  await getUserInfo();
  await logout();
  await uploadForm();
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
  const userName = document.querySelector("#userName");
  userName.innerText = `username: ${data.username}`;
};

getGames = async() =>{
  const res = await fetch('/product/games');
  data = await res.json();

  const gameListContainerDiv = document.querySelector(".gamelist-container");

  for (let game of data) {
      const gameLsDiv = document.createElement("div");
      const imgElement = document.createElement("img")
      const desDiv = document.createElement("div");
      const consoleElement = document.createElement("span")
      const nameElement = document.createElement("h5")
      const priceElement = document.createElement("h5")

      gameLsDiv.className = "game-ls"
      gameLsDiv.dataset.bsToggle = "modal"

      gameLsDiv.dataset.bsTarget = `#game${game.id}`

      imgElement.src = './' + game.image;
      desDiv.className = "des";
      consoleElement.innerText = game.console;
      nameElement.innerText = game.name;
      priceElement.innerText = `$${game.price}`;

      desDiv.appendChild(consoleElement);
      desDiv.appendChild(nameElement);
      gameLsDiv.appendChild(imgElement);
      gameLsDiv.appendChild(desDiv);
      gameLsDiv.appendChild(priceElement);

      gameListContainerDiv.appendChild(gameLsDiv)

  }
}
genGameModal = async() =>{
  const res = await fetch('/product/games');
  data = await res.json();
  let gameListContainerInnerHTML = "";
  const gameListContainerDiv = document.querySelector(".gamelist-container");

  for(let game of data){
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
                <div class="row">
                  <span>${game.name}</span>
                  <span>${game.price}</span>
                  <span>${game.console}</span>
                  <span>${game.description}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
              <button class='btn add-to-cart-button' data-id=${game.id}>ADD TO CART</button>
          </div>
        </div>
      </div>
    </div>`
  }
}

const uploadForm = async () => {
  const form = document.querySelector("#upform");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData()
    formData.append('customFile', form.customFile.files[0])
    formData.append('productname', form.productname.value)
    formData.append('price', form.price.value)
    formData.append('gameplatform', form.gameplatform.value)
    formData.append('gametype', form.gametype.value)
    formData.append('description', form.description.value)

    formData.append('displayProduct', form.displayProduct.value)

    const resp = await fetch("/product", {
      method: "POST",
      body: formData,
    });
    if (resp.status === 200) {
      const respJson = await resp.json()
      console.log('server response: ', respJson)
      alert("uploaded")
    }
    if (resp.status === 400) {
      alert('price is not number')
    }
    if (resp.status === 401) {
      alert('too expensive')
    }
  });
};
