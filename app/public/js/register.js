
const form = document.getElementById('registerForm')
form.addEventListener('submit',async (e) => {
    e.preventDefault();
    const fd = new FormData(form)

    const payload = {
        username: fd.get('username'),
        email: fd.get('email'),
        password: fd.get('password')
    }

    try {
        const res = await fetch('/auth/register',{
            method:'POST',
            headers:{'Content-Type' : "application/json"},
            body: JSON.stringify(payload)
        })

        const data = await res.json();

        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)

        if(!res.ok) throw new Error('sunucu hatası');
        window.location.href = '/auth/login'

    } catch (error) {
        console.error(error)
    }
})