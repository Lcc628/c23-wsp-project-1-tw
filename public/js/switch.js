window.onload = () => {
    showLoginBox();
    showRegisterBox();
    login();
    register();
    getGames();

}

register = () =>{
    document.querySelector("#registerForm").addEventListener("submit", async(e)=>{
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
        const res = await fetch("/register",{
            method:"POST",
            body: formData
        })
        const data = await res.json()
        if(res.status == 200){
            alert(data.message)
        }else{
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
        if (res.status == '200') {
            const {message} = await res.json()
            console.log(message)
            window.location = "./user.html"
        }else{
            const {message} = await res.json();
            alert(message)
        }

    })

}

showLoginBox = () => {
    document.querySelector("#loginBoxBtn").addEventListener("click", () => {
        const display = document.querySelector(".loginBox").style.display
        if (display == 'block') {
            document.querySelector(".loginBox").style.display = 'none';
        } else {
            document.querySelector(".loginBox").style.display = 'block';
        }
    }
    )
}
showRegisterBox = () =>{
    document.querySelector("#registerBoxBtn").addEventListener("click", () => {
        const display = document.querySelector(".registerBox").style.display
        if (display == 'block') {
            document.querySelector(".registerBox").style.display = 'none';
        } else {
            document.querySelector(".registerBox").style.display = 'block';
        }
    }
    )
}

getGames = async() =>{
    const res = await fetch('/switchGames');
    data = await res.json();

    const gameListContainerDiv = document.querySelector(".gamelist-container");

    for(let game of data){
        if(game.is_valid){
            const gameLsDiv = document.createElement("div");
            const imgElement = document.createElement("img")
            const desDiv = document.createElement("div");
            const consoleElement = document.createElement("span")
            const nameElement = document.createElement("h5")
            const priceElement = document.createElement("h5")
    
        gameLsDiv.className = "game-ls"
        imgElement.src = game.image;
        desDiv.className = "des";
        consoleElement.innerText = game.console;
        nameElement.innerText = game.name;
        priceElement.innerText = game.price;
        
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