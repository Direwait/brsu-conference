async function logout() {
    try {
        const response = await fetch('https://conf_server.brsu.by:8888/users/logout', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'withtoken': true
            }
        });
        if (response.ok) {
            localStorage.removeItem('conf_data');
            location.reload();
        } else {
            console.error('Ошибка сервера:', response.status);
        }
    } catch (error) { 
        console.error("Ошибка с запросом выхоода из профиля",error);
    }
}

async function codeOnEmail() {
    try {
        const email = document.getElementById('email').value;
        const response = await fetch('https://conf_server.brsu.by:8888/users/reset-code', {
            method: "POST",
            headers: {
                'content-type': 'application/json',
                'withtoken': false
            },
            body: JSON.stringify({
                email: email
            })
        });
        const responseData = await response.json();
        localStorage.setItem('resetUserId', responseData);
        // console.log(localStorage.getItem('resetUserId'));
        changeContent('front/page/newPassword.html');
    } catch (error) {
        console.error("Ошибка с запросом на оптравку кода на почту", error)
    }
}

async function changePassword() {
    try {
        const code = document.getElementById('code').value;
        const password = document.getElementById('newPassword').value;
        
        const response = await fetch('https://conf_server.brsu.by:8888/users/reset-pass', {
            method: "POST",
            headers: {
                'content-type': 'application/json',
                'withtoken': false
            },
            body: JSON.stringify({
                id: localStorage.getItem('resetUserId'),
                code: code,
                password: password
            }) 
        });
        changeContent('front/page/login.html');
        return response.status;
    } catch (error) {
        console.error("ошибка", error)
    }
}