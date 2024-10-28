document.addEventListener("DOMContentLoaded", async function() {
    const containerCards = document.querySelector('.container-cards');

    // Função para buscar favoritos do backend
    async function buscarFavoritos() {
        const url = `${ambiente.local + prefix.avaliacoes}`;
        const request = new Request({
            newQueryStringParams: { favorito: true }
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
                nome: favorito.produto.nome,
                descricao: favorito.descricao || 'Sem descrição',
                preco: favorito.produto.preco,
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
                <h2><span>R$</span> ${favorito.preco.toFixed(2)}</h2>
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
        const url = `${ambiente.local + prefix.avaliacoes}`;
        const request = new Request({
            method: 'DELETE',
            newQueryStringParams: { usuario: 1, produto: favorito.id }
        });

        try {
            await new FetchBuilder().request(url, request);
            buscarFavoritos(); // Recarregar os favoritos
        } catch (error) {
            console.error("Erro ao remover favorito:", error);
        }
    }

    // Carregar os favoritos ao iniciar
    await buscarFavoritos();
});
