window.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("/api/current-user", {
            method: "GET",
            credentials: "include"
        });

        const data = await res.json()
        console.log("current user:",data.username);

        const el = document.createElement('div')
        el.innerText= data.username;
        document.getElementById('div').appendChild(el)


        document.getElementById('logoutBtn').onclick = async() => {
            try {
                const res = await fetch('/auth/logout',{
                    credentials:'include',
                    method:'POST',
                    headers:{'Content-Type':  "application/json"}
                })

                const data = await res.json()
                alert(data.message)
                window.location.href = "/"
            } catch (error) {
                console.error("logout err: ",error)
            }
        }
        } catch (err) {
        console.error("current-user fetch error:", err);
        }

  });
