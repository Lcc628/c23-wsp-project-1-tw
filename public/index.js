window.onload = () => {
    showLoginBox()
    login();

}
console.log("ABC")

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
            // const {message,username} = await res.json()
            // document.querySelector("#loginBoxBtn").style.display = 'none'
            // document.querySelector("#RegBoxBtn").style.display = 'none'
            // document.querySelector(".loginBox").style.display = 'none'
            // document.querySelector("#userDetail").style.display = 'block'
            // document.querySelector("#username").innerText = `用戶名稱：`+ username
            window.location = "./user.html"
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