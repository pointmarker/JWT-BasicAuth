const form = document.getElementById('loginForm')

form.addEventListener('submit',async(e) => {
    e.preventDefault();
    const fd = new FormData(form);

    const payload = {
        username: fd.get('username'),
        password: fd.get('password')
    }
    try {
        const res = await fetch('/auth/login',{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
            credentials:'include'
        })
    
        if(!res.ok){
            throw new Error('login res çalışmadı')
        }

        const data = await res.json();
        
        window.location.href = `/user/${data.username}`
        
    } catch (error) {
        console.error(error)
    }
})