const idUsuario = sessionStorage.getItem('idUsuario');

async function cadastrarEndereco() {

    if (idUsuario) {
        const bairro = document.getElementById('bairro');
        const logradouro = document.getElementById('logradouro');
        const numero = document.getElementById('numero');
        const complemento = document.getElementById('complemento');
        const cep = document.getElementById('cep');

        const bairroValue = bairro.value;
        const logradouroValue = logradouro.value;
        const numeroValue = numero.value;
        const complementoValue = complemento.value;
        const cepValue = cep.value.replace(/\D/g, '');

        // Validação simples dos campos obrigatórios
        if (!bairroValue || !logradouroValue || !numeroValue || !cepValue) {
            exibirPopup("Oops, você não preencheu todos os campos...", "erro");
            return;
        }

        try {
            const url = `http://localhost:8080/usuarios/${idUsuario}/enderecos`;

            // Definindo os cabeçalhos corretamente
            const headers = {
                "Content-Type": "application/json"
            };

            // Fazendo a requisição POST
            const resposta = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    cep: cepValue,
                    rua: logradouroValue,
                    bairro: bairroValue,
                    numero: numeroValue,
                    complemento: complementoValue
                })
            });

            // Verificando o status da resposta
            if (resposta.status === 201 || resposta.status === 200) {
                exibirPopup("Seu endereço foi cadastrado!", "success");
            } else if (resposta.status === 418) {
                const errorData = await resposta.json();
                console.log('Erro ao cadastrar:', errorData);
                exibirPopup(errorData.message, "erro");
            } else {
                const errorData = await resposta.json();
                console.log('Erro ao cadastrar:', errorData);
                exibirPopup("Erro ao cadastrar endereço.", "erro");
            }
        } catch (error) {
            console.error("Erro ao cadastrar endereço:", error);
            exibirPopup("Erro ao cadastrar endereço.", "erro");
        }

    } else {
        console.log('ID do usuário não encontrado no sessionStorage.');
    }
}

// Função para exibir o popup de sucesso ou erro
function exibirPopup(mensagem, tipo) {
    const popup = document.getElementById("popup");
    const popupIcon = document.getElementById("popup-icon");
    const popupTitle = document.getElementById("popup-title");
    const popupMessage = document.getElementById("popup-message");

    if (tipo === "success") {
        popupIcon.src = "/ZKFood/assets/sucesso.png";
        popupTitle.textContent = "Sucesso!";
        popupTitle.style.color = "#33D700";
    } else {
        popupIcon.src = "/ZKFood/assets/erro.png";
        popupTitle.textContent = "Erro!";
        popupTitle.style.color = "#EB3223";
    }

    popupMessage.textContent = mensagem;
    popup.style.display = "flex";
}

// Função para fechar o popup
function closePopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "none";
}
