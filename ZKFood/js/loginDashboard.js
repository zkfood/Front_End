document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector('.botao-login').addEventListener('click', login);
});

async function loginDashboard() {
    const url = 'http://localhost:8080/usuarios/entrar/dashboard';

    try {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', '*/*');
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const resposta = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                email: email,
                senha: password
            })
        });

        if (resposta.ok) {
            const respostaJson = await resposta.json();

            // Guardar todos os dados do usuário no sessionStorage
            sessionStorage.setItem('usuario', JSON.stringify(respostaJson));
            sessionStorage.setItem('idUsuario', JSON.stringify(respostaJson.id))

            showPopup('LOGIN FEITO COM SUCESSO!', 'Bem vindo a sua tela de análises!', 'success', () => {
                window.location.href = "../../html/dashboard/dashboard_produto.html";
            });
        } else if (resposta.status === 400) { 
            showPopup('ERRO NO LOGIN!', '(Campos de email e senha são obrigatórios)', 'error'); 
        } else if (resposta.status === 500 || resposta.status === 204) { 
            showPopup('ERRO NO LOGIN!', '(Email ou senha incorretos)', 'error');
        } else if (resposta.status === 401 || resposta.status === 500 || resposta.status === 204) { 
            showPopup('ERRO NO LOGIN!', '(Usuário não autorizado)', 'error');
        }
    } catch (erro) {
        console.log("Erro: ", erro);
        showPopup('ERRO NO LOGIN!', '(Email ou senha incorretos)', 'error');
    }
}

function showPopup(title, message, type, callback) {
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const popupIcon = document.getElementById('popup-icon');
    popupTitle.textContent = title;
    popupMessage.textContent = message;

    if (type === 'success') {
        popupTitle.style.color = '#33D700';
        popupIcon.src = '../../assets/sucesso.png'; 
    } else if (type === 'error') {
        popupTitle.style.color = '#EB3223';
        popupIcon.src = '../../assets/erro.png';
    }

    popup.style.display = 'flex';


    setTimeout(() => {
        closePopup();
        if (callback) {
            callback();
        }
    }, 1250); 
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}