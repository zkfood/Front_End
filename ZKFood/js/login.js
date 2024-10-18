document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector('.botao-login').addEventListener('click', login);
});

async function login() {
    const url = 'http://localhost:8080/usuarios/entrar';

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
            const respostaTexto = await resposta.text();
            if (respostaTexto) {
                const respostaJson = JSON.parse(respostaTexto);
                console.log('JSON: ', respostaJson);
                showPopup('LOGIN FEITO COM SUCESSO!', 'Que tal uma feijoada?!', 'success');


                window.location.href = "../../html/cliente/home_pos_login.html"
            } else {
                console.log('Resposta não contém corpo.');
            }
        } else if (resposta.status === 400) {
            showPopup('ERRO NO LOGIN!', '(E-mail ou senha estão incorretos)', 'error');
        } else if (resposta.status === 409) {
            showPopup('ERRO NO LOGIN!', '(Há campos vazios)', 'error');
        }
    } catch (erro) {
        console.log("Erro: ", erro);
    }
}

function showPopup(title, message, type) {
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const popupIcon = document.getElementById('popup-icon');

    popupTitle.textContent = title;
    popupMessage.textContent = message;

    if (type === 'success') {
        popupTitle.style.color = '#33D700';
        popupIcon.src = '../assets/sucesso.png'; // Substitua pelo caminho do ícone de sucesso
    } else if (type === 'error') {
        popupTitle.style.color = '#EB3223';
        popupIcon.src = '../assets/erro.png'; // Substitua pelo caminho do ícone de erro
    }

    popup.style.display = 'flex';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}