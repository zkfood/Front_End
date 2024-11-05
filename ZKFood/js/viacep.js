async function buscarCEP() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');

    if (cep !== "") {
        const validacep = /^[0-9]{8}$/;

        if (validacep.test(cep)) {

            try {
                const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await resposta.json(); // Convertendo a resposta para JSON

                if (data.erro) {
                    exibirPopup("CEP não encontrado.", "erro")
                    return;
                }

                // Preenchendo os campos com os dados retornados da API
                document.getElementById('bairro').value = data.bairro;
                document.getElementById('logradouro').value = data.logradouro;
                document.getElementById('complemento').value = data.complemento || '';
            } catch (error) {
                exibirPopup("Erro ao buscar o CEP. Tente novamente.", "erro")
            }

        } else {
            // TODO: colocar span com cor vermelha para exibir mensagem de erro no formulário
            exibirPopup("Formato de CEP inválido.", "erro")
            
        }
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
