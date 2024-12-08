async function cadastrarPedido() {
    const usuario = sessionStorage.getItem('idUsuario');
    const endereco = sessionStorage.getItem('IdEnderecoEscolhido');
    const tipoEntrega = sessionStorage.getItem('TIPO_ENTREGA_CARRINHO');
    const produtos = JSON.parse(sessionStorage.getItem('PRODUTOS_CARRINHO'));

    if (!endereco && tipoEntrega === "Entrega") {
        exibirPopup("Parece que houve algum erro ao tentar adicionar seu endereço ao pedido, tente novamente", "error");
        await new Promise(resolve => setTimeout(resolve, 2000));

        window.location = "./carrinho.html";
    }

    const pedido = await fetch(`${ambiente.local}${prefix.pedidos}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario,
            produtos,
            endereco,
            tipoEntrega
        })
    })

    exibirPopup("Seu pedido foi registrado!", "success")
    await new Promise(resolve => setTimeout(resolve, 3000));

    sessionStorage.removeItem('ENDERECO_CARRINHO');
    sessionStorage.removeItem('TIPO_ENTREGA_CARRINHO');
    sessionStorage.removeItem('PRODUTOS_CARRINHO');

    window.location = './historico-pedidos.html'
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