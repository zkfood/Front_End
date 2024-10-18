document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector('.botao-cadastro').addEventListener('click', cadastro);
});

async function cadastro() {
    const url = 'http://localhost:8080/usuarios';
    
    try {
        // Definindo os headers
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', '*/*');
        
        // Pegando os valores do formulário
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("password").value;
        const cpf = document.getElementById("cpf").value.replace(/\D/g, ''); // Remove caracteres não numéricos
        const telefone = document.getElementById("telefone").value;
        const confirmaSenha = document.getElementById("confirm-password").value;
        const lembrar = document.getElementById("remember-me").checked;

        // Validações simples no front-end
        if (senha !== confirmaSenha) {
            showPopup('Erro', 'As senhas não coincidem!', 'error');
            return;
        }

        // Enviando a requisição para o servidor
        const resposta = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                nome: nome,
                email: email,
                senha: senha,
                cpf: cpf,
                telefone: telefone,
                lembrar: lembrar
            })
        });

        if (resposta.ok || resposta.status == 201 || resposta.status == 500) {
            const usuario = await resposta.json();
            console.log('Usuário cadastrado com sucesso:', usuario);
            showPopup('Cadastro Realizado', 'Seu cadastro foi realizado com sucesso!', 'success');
            window.location.href = "../../html/cliente/login.html";
        } else if (resposta.status === 400) {
            showPopup('Erro no Cadastro', 'Dados inválidos ou campos obrigatórios não preenchidos!', 'error');
        } else if (resposta.status === 409) {
            showPopup('Erro no Cadastro', 'Usuário já existe!', 'error');
        }
    } catch (erro) {
        console.log("Erro: ", erro);
        showPopup('Erro', 'Ocorreu um erro inesperado. Tente novamente.', 'error');
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
        popupIcon.src = '../assets/sucesso.png'; // Ícone de sucesso
    } else if (type === 'error') {
        popupTitle.style.color = '#EB3223';
        popupIcon.src = '../assets/erro.png'; // Ícone de erro
    }

    popup.style.display = 'flex';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}
