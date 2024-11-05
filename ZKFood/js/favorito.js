document.addEventListener("DOMContentLoaded", async function() {
    const containerCards = document.querySelector('.container-cards');
    const idUsuario = sessionStorage.getItem('idUsuario');

    // Função para buscar favoritos do backend
    async function buscarFavoritos() {
        const url = `${ambiente.local + prefix.avaliacoes}`;
        const request = new Request({
            newQueryStringParams: { favorito: true, usuario: idUsuario },
        });

        try {
            const fetch = await new FetchBuilder().request(url, request);
            renderizarFavoritos(fetch);
        } catch (error) {
            console.error("Erro ao buscar favoritos:", error);
        }
    }

    // Função para renderizar os favoritos
    function renderizarFavoritos(favoritos) {
        containerCards.innerHTML = "";

        favoritos.forEach(favorito => {
            const prato = {
                idProduto: favorito.produto.id,
                nome: favorito.produto.nome,
                descricao: favorito.descricao || 'Sem descrição',
                valor: favorito.produto.valor,
                imagem: `${ambiente.local+prefix.produtos}/imagem/${favorito.produto.id}`,
                favorito: favorito.favorito
            };
            adicionarCard(prato, containerCards);
        });
    }

    // Função para adicionar um card
    function adicionarCard(favorito, container) {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <img class="img-prato" src="${favorito.imagem}" alt="foto do prato">
            <h1>${favorito.nome}</h1>
            <p>${favorito.descricao}</p>
            <div class="card-menu">
                <h2><span>R$</span> ${favorito.valor.toFixed(2)}</h2>
                <div class="card-botoes">
                    <button class="botao-carrinho"><img src="../../assets/carrinho-carrinho-branco.png" style="margin-right: 3px;" alt="icone de carrinho de compras"></button>
                    <button class="botao-lixo"><img src="../../assets/Trash.png" alt="icone de lixo"></button>
                </div>
            </div>
        `;

        // Adicionar event listener para remover dos favoritos
        const botaoLixo = card.querySelector('.botao-lixo');
        botaoLixo.addEventListener('click', () => removerFavorito(favorito));

        container.appendChild(card);
    }

    async function removerFavorito(favorito) {
        try {
            const url = `${ambiente.local + prefix.avaliacoes}?usuario=${idUsuario}&produto=${favorito.idProduto}`;

            await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            exibirPopup("Deletado com sucesso", "success")
            await buscarFavoritos(); // Recarregar os favoritos
        } catch (error) {
            console.error("Erro ao remover favorito:", error);
        } finally {
            window.reload()
        }
    }

    // Carregar os favoritos ao iniciar
    await buscarFavoritos();
});

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
