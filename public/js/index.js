window.onload = () => {
    login();
    register();
    getGames();
    genGameModal();

}

register = () => {
    document.querySelector("#registerForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const username = form.username.value;
        const password = form.password.value;
        const email = form.email.value;
        const address = form.address.value;
        const phoneNum = form.phoneNum.value;

        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)
        formData.append('email', email)
        formData.append('address', address)
        formData.append('phoneNum', phoneNum)
        formData.append('icon', form.icon.files[0])
        const res = await fetch("/register", {
            method: "POST",
            body: formData
        })
        const data = await res.json()
        if (res.status == 200) {
            alert(data.message)
        } else {
            alert(data.message)
        }
    })
}

login = () => {
    document.querySelector("#loginForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const username = form.username.value;
        const password = form.password.value;
        console.log(username, password)
        const res = await fetch('/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({ username, password }),
        })
        console.log(res)


        //admin login test
        if (res.status == '201') {
            const { message } = await res.json()
            console.log(message);
            window.location = "./admin.html"
        }


        else if (res.status == '200') {
            const { message } = await res.json()
            console.log(message)
            window.location = "./user.html"
        }
        else {
            const { message } = await res.json();
            alert(message)
        }

    })

}

getGames = async () => {
    const res = await fetch('/games');
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
        gameLsDiv.dataset.bsTarget = `#${game.name}`
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
    console.log(data)
}



/* <div class="game-ls">
              <img src="https://i.openshop.com.hk/upload/202202/621c65b983f19.jpg">
              <div class="des">
                  <span>Nintendo Switch 遊戲</span>
                  <h5>NS Pokemon《寶可夢 朱/紫》</h5>
              </div>
              <h5>HKD$340.00 ~ 680.00</h5>
            </div> */



genGameModal = async () => {
    const res = await fetch('/games');
    data = await res.json();

    const gameListContainerDiv = document.querySelector(".gamelist-container");

    for (let game of data) {
        if (game.is_valid) {
            const modalFadeDiv = document.createElement("div")
            const modalDialogDiv = document.createElement("div")
            const modalContentDiv = document.createElement("div")
            const modalHeaderDiv = document.createElement("div")
            const closeBtn = document.createElement("button")
            const modalBodyDiv = document.createElement("div")
            const imgRowDiv = document.createElement("div")
            const gameImgElem = document.createElement("img")
            const gameInfoDiv = document.createElement("div")
            const infoRowDiv = document.createElement("div")
            const nameSpan = document.createElement("span")
            const priceSpan = document.createElement("span")
            const consoleSpan = document.createElement("span")
            const cateSpan = document.createElement("span")
            const desSpan = document.createElement("span")
            const modalFooterDiv = document.createElement("div")

            modalFooterDiv.className = "modal-footer"

            nameSpan.innerText = (game.name)
            priceSpan.innerText = (game.price)
            consoleSpan.innerText = (game.console)
            cateSpan.innerText = (game.game_cate)
            desSpan.innerText = (game.description)

            infoRowDiv.className = "row"
            infoRowDiv.appendChild(nameSpan)
            infoRowDiv.appendChild(priceSpan)
            infoRowDiv.appendChild(consoleSpan)
            infoRowDiv.appendChild(cateSpan)
            infoRowDiv.appendChild(desSpan)

            gameInfoDiv.className = "col-md-6"
            gameInfoDiv.append(infoRowDiv)

            gameImgElem.className = "col-md-6"
            gameImgElem.src = game.image;

            imgRowDiv.className = "row"
            imgRowDiv.appendChild(gameImgElem)
            imgRowDiv.appendChild(gameInfoDiv)

            modalBodyDiv.className = "modal-body"
            modalBodyDiv.appendChild(imgRowDiv)

            closeBtn.type = "button"
            closeBtn.className = "btn-close"
            closeBtn.dataset.bsDismiss = "modal"
            closeBtn.ariaLabel = "Close"
            modalHeaderDiv.className = "modal-header"
            modalHeaderDiv.appendChild(closeBtn)

            modalContentDiv.className = "modal-content"
            modalContentDiv.appendChild(modalHeaderDiv)
            modalContentDiv.appendChild(modalBodyDiv)
            modalContentDiv.appendChild(modalFooterDiv)

            modalDialogDiv.className = "modal-dialog modal-xl"
            modalDialogDiv.appendChild(modalContentDiv)

            modalFadeDiv.className = "modal fade"
            modalFadeDiv.id = `${game.name}`
            modalFadeDiv.tabIndex = "-1"
            modalFadeDiv.ariaHidden = "true"
            modalFadeDiv.appendChild(modalDialogDiv)

            gameListContainerDiv.appendChild(modalFadeDiv)

        }
    }
    console.log(data)
}