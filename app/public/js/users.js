window.onload = async function(){
    const token = localStorage.getItem('access_token')

    if(token){
        try {
            const res = await fetch('/auth/users',{
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if(!res.ok) throw new Error('sunucu hatası')
            const users = await res.json();
            console.log(users)
            //dinamik olarak usersı görüntüle
        } catch (error) {
            console.error(error)
        }
    }
    else{
        alert('lütfen oturum açınız')
        setTimeout(() => {
            window.location.href = "/auth/login"
        },100)
    }1
}