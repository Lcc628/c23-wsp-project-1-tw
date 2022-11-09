window.onload = ()=>{
    document.querySelector("#loginForm").addEventListener("submit",async (e)=>{
        e.preventDefault();
        const form = e.target;
        const username = form.username.value;
        const password = form.password.value;
        console.log(username,password)
        const res = await fetch('/login',{
            method:"POST",
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
              },
              body: JSON.stringify({ username,password}),
        })

    })
}