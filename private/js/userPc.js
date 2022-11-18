window.onload = async() => {
    await getGames();
    await genGameModal();
    await getUserInfo();
    // await addToCart();
    await logout();
    await clearCart();
}

logout = async() =>{
    document.querySelector('#logOutBtn').addEventListener('click',async (e)=>{
        console.log('click')
        const res = await fetch('/logout');
        data = await res.json()
        console.log(data)
        if(data.status = '200'){
            alert("Logged out")
            window.location = "./"
        }
    })
}

getUserInfo = async() =>{
    const res = await fetch('/loginUserInfo');
    data = await res.json();
    const userName = document.querySelector("#userName")
    userName.innerText = `username: ${data.username}`
}

getGames = async() =>{
    const res = await fetch('/pcGames');
    data = await res.json();

    const gameListContainerDiv = document.querySelector(".gamelist-container");

    for (let game of data) {
        if(game.is_valid){
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



genGameModal = async() =>{
    const res = await fetch('/games');
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
                <button class='btn add-to-cart-button' data-id=${game.id}>ADD TO CART</button>
            </div>
          </div>
        </div>
      </div>
      `
      gameListContainerDiv.innerHTML += gameListContainerInnerHTML;
    //   console.log(gameListContainerDiv.innerHTML)
            // const modalFadeDiv = document.createElement("div")
            // const modalDialogDiv = document.createElement("div")
            // const modalContentDiv = document.createElement("div")
            // const modalHeaderDiv = document.createElement("div")
            // const closeBtn = document.createElement("button")
            // const modalBodyDiv = document.createElement("div")
            // const imgRowDiv = document.createElement("div")
            // const gameImgElem = document.createElement("img")
            // const gameInfoDiv = document.createElement("div")
            // const infoRowDiv = document.createElement("div")
            // const nameSpan = document.createElement("span")
            // const priceSpan = document.createElement("span")
            // const consoleSpan = document.createElement("span")
            // const cateSpan = document.createElement("span")
            // const desSpan = document.createElement("span")
            // const modalFooterDiv = document.createElement("div")
            // const addToCartBtn = document.createElement("button")

            // //gen addBtn id  delete this line if wrong tmr
            // addToCartBtn.id = `addBtn-${game.id}`

            // addToCartBtn.innerText = "add to cart"
            // addToCartBtn.className = "btn btn-primary"
            // addToCartBtn.setAttribute('dataset-id', game.id)
            // addToCartBtn.type = "button"
            // modalFooterDiv.className = "modal-footer"
            // modalFooterDiv.appendChild(addToCartBtn)


            // nameSpan.innerText = (game.name)
            // priceSpan.innerText = (game.price)
            // consoleSpan.innerText = (game.console)
            // cateSpan.innerText = (game.game_cate)
            // desSpan.innerText = (game.description)
            
            // infoRowDiv.className = "row"
            // infoRowDiv.appendChild(nameSpan)
            // infoRowDiv.appendChild(priceSpan)
            // infoRowDiv.appendChild(consoleSpan)
            // infoRowDiv.appendChild(cateSpan)
            // infoRowDiv.appendChild(desSpan)

            // gameInfoDiv.className = "col-md-6"
            // gameInfoDiv.append(infoRowDiv)

            // gameImgElem.className = "col-md-6"
            // gameImgElem.src = game.image;

            // imgRowDiv.className = "row"
            // imgRowDiv.appendChild(gameImgElem)
            // imgRowDiv.appendChild(gameInfoDiv)

            // modalBodyDiv.className = "modal-body"
            // modalBodyDiv.appendChild(imgRowDiv)

            // closeBtn.type = "button"
            // closeBtn.className = "btn-close"
            // closeBtn.dataset.bsDismiss = "modal"
            // closeBtn.ariaLabel = "Close"
            // modalHeaderDiv.className = "modal-header"
            // modalHeaderDiv.appendChild(closeBtn)

            // modalContentDiv.className = "modal-content"
            // modalContentDiv.appendChild(modalHeaderDiv)
            // modalContentDiv.appendChild(modalBodyDiv)
            // modalContentDiv.appendChild(modalFooterDiv)

            // modalDialogDiv.className = "modal-dialog modal-xl"
            // modalDialogDiv.appendChild(modalContentDiv)

            // modalFadeDiv.className = "modal fade"
            // modalFadeDiv.id = `${game.name}`
            // modalFadeDiv.tabIndex = "-1"
            // modalFadeDiv.ariaHidden = "true"
            // modalFadeDiv.appendChild(modalDialogDiv)

            // gameListContainerDiv.appendChild(modalFadeDiv)

        
    }
    addToCart()
}

addToCart = () =>{

    const gameCartDiv =document.querySelector("#gameCart")

    document.querySelectorAll(".add-to-cart-button").forEach(e =>{
        e.addEventListener("click",async(e)=>{
            
            gameCartDiv.innerHTML = ""
            const addBtn = e.target;
            // const id = addBtn.id.split("-")[1];
            const id = addBtn.dataset.id;
            console.log('click: ', id)

            const res = await fetch(`/games/${id}`)
            const data = await res.json();
            if(res.status = '200'){
                alert("add item success")
            }
            console.log(data)

            for(let game of data){                
                const nameSpan = document.createElement("span")
                const priceSpan = document.createElement("span")
                nameSpan.innerText = `name: ${game.name}`
                priceSpan.innerText = `price: ${game.price}`

                const gameInfoDiv = document.createElement("div")
                gameInfoDiv.className = "row"
                gameInfoDiv.appendChild(nameSpan)
                gameInfoDiv.appendChild(priceSpan)

                const infoColDiv = document.createElement("div")
                infoColDiv.className = "col-md-4"
                infoColDiv.appendChild(gameInfoDiv)

                const imgDiv = document.createElement("img")
                imgDiv.className = "col-md-3"
                imgDiv.src = `${game.image}`

                const gamesDivRow = document.createElement("div")
                gamesDivRow.className = "row"
                gamesDivRow.appendChild(imgDiv)
                gamesDivRow.appendChild(infoColDiv)

                gameCartDiv.appendChild(gamesDivRow)
                
            
            }
            
        })
    })
}

clearCart = () =>{
    document.querySelector("#clearBtn").addEventListener("click",async (e)=>{
        const res = await fetch('/clearCart');
        
        data = await res.json();
        console.log(data)
        const cartContent = document.querySelector("#gameCart")
        cartContent.innerHTML=""
        if(res.status=='200'){
            alert("clear success")
        }
    })
    
}