const form = document.getElementById('loginForm')

form.addEventListener('submit',async(e) => {
    const fd = new FormData(form);

    const payload = {
        username: fd.get('username'),
        password: fd.get('password')
    }

    const res = await fetch('/auth/login',{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: payload
    })

    const data = await res.json();

    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)

    window.location.href = `/auth/user/${data.username}`

    if(res.ok){

    }else{
        throw new Error("login hatası")
    }
})