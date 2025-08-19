window.onload = async function(){
    const token = localStorage.getItem('access_token');

    if(token){
        const pathParts =  window.location.pathname.split("/");
        const username = pathParts.length > 4 ? pathParts[4] : null;
        if(username){
            const res = await fetch(`/auth/user/${username}`,{
                method: 'GET',
                headers: {'Content-Type': "application/json", "Authorization" : `Bearer ${token}`},
            }) 

            if(!res.ok) throw new Error('hata') 

            const data = await res.json();
            console.log(data)

        }else{
            alert('geçersiz isim')
            setTimeout(() => {
                window.location.href = "/auth/login"
            },100)
        }
    }
    else{
        alert('lütfen giriş yapın')
        setTimeout(() =>{
            window.location.href ='/auth/login'
        },100)
    }
}