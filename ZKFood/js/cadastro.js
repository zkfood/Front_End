document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.botao-cadastro').addEventListener('click', checkTermos);
});

async function cadastro() {
    const usuario = await cadastroUsuario();
    if (usuario) {
        await cadastroTelefone(usuario.id);
    }
}

async function cadastroUsuario() {
    const urlUsuario = 'http://localhost:8080/usuarios';
    
    const headers = gerarHeaders();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value.trim();
    const confirmaSenha = document.getElementById("confirm-password").value.trim();
    const cpf = document.getElementById("cpf").value.replace(/\D/g, '');

    if (!validarCamposUsuario(nome, email, senha, confirmaSenha, cpf)) return;

    try {
        const respostaUsuario = await fetch(urlUsuario, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ nome, email, senha, cpf })
        });

        if (respostaUsuario.ok || respostaUsuario.status === 201) {
            const usuario = await respostaUsuario.json();
            console.log('Usuário cadastrado com sucesso:', usuario);
            showPopup('Cadastro Realizado', 'Usuário cadastrado com sucesso!', 'success');
            return usuario;
        } else {
            tratarErros(respostaUsuario.status, 'usuario');
        }
    } catch (erro) {
        console.log("Erro: ", erro);
        showPopup('Erro', 'Ocorreu um erro inesperado no cadastro do usuário. Tente novamente.', 'error');
    }
}

async function cadastroTelefone(usuarioId) {
    const urlTelefone = `http://localhost:8080/usuarios/${usuarioId}/telefones`;
    
    const headers = gerarHeaders();
    const telefone = document.getElementById("telefone").value.trim();

    if (!telefone) {
        showPopup('Erro', 'O campo telefone deve ser preenchido!', 'error');
        return;
    }

    try {
        const respostaTelefone = await fetch(urlTelefone, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ numero: telefone })
        });

        if (respostaTelefone.ok || respostaTelefone.status === 201) {
            const telefoneCadastrado = await respostaTelefone.json();
            console.log('Telefone cadastrado com sucesso:', telefoneCadastrado);
            //showPopup('Cadastro Realizado', 'Telefone cadastrado com sucesso!', 'success');
            // window.location.href = "../../html/cliente/login.html";
        } else {
            tratarErros(respostaTelefone.status, 'telefone');
        }
    } catch (erro) {
        console.log("Erro: ", erro);
        showPopup('Erro', 'Ocorreu um erro inesperado no cadastro do telefone. Tente novamente.', 'error');
    }
}

function gerarHeaders() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', '*/*');
    return headers;
}

function validarCamposUsuario(nome, email, senha, confirmaSenha, cpf) {
    if (!nome || !email || !senha || !confirmaSenha || !cpf) {
        showPopup('Erro', 'Todos os campos devem ser preenchidos!', 'error');
        return false;
    }
    if (senha !== confirmaSenha) {
        showPopup('Erro', 'As senhas não coincidem!', 'error');
        return false;
    }
    return true;
}

function tratarErros(status, entidade) {
    if (status === 400) {
        showPopup('Erro no Cadastro', `Dados inválidos ou campos obrigatórios não preenchidos! (${entidade})`, 'error');
    } else if (status === 409) {
        showPopup('Erro no Cadastro', `${entidade.charAt(0).toUpperCase() + entidade.slice(1)} já existe!`, 'error');
    } else {
        showPopup('Erro no Cadastro', 'Erro no servidor, tente novamente mais tarde.', 'error');
    }
}

function showPopup(title, message, type) {
    console.log('Exibindo popup:', title, message, type); // Log para depuração
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const popupIcon = document.getElementById('popup-icon');

    popupTitle.textContent = title;
    popupMessage.textContent = message;

    popupTitle.style.color = type === 'success' ? '#33D700' : '#EB3223';
    popupIcon.src = type === 'success' ? '../../assets/sucesso.png' : '../../assets/erro.png';

    popup.style.display = 'flex';
    setTimeout(closePopup, 5000); // Fecha o pop-up após 5 segundos
}

function closePopup() {
    console.log('Fechando popup'); // Log para depuração
    document.getElementById('popup').style.display = 'none';
}

function checkTermos() {
    const checkbox = document.getElementById("accept-terms");

    if (checkbox.checked) {
        // Se o checkbox estiver marcado, chama a função de cadastro
        cadastro();
    } else {
        // Exibe o popup com mensagem de erro
        showPopup('Atenção', 'Você deve aceitar os Termos e Condições para continuar.', 'error');
    }
}

