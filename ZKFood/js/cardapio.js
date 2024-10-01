document.addEventListener("DOMContentLoaded", async function() {
    const containerCards = document.querySelector('.container-cards');
    const userId = 1; //chumbado 
    
    async function buscarFavoritos() {
        const url = `${ambiente.local + prefix.avaliacoes}`;
        const request = new Request({
            newQueryStringParams: { usuario: userId, favorito: true }
        });

        try {
            const fetch = await new FetchBuilder().request(url, request);
            renderizarFavoritos(fetch);
        } catch (error) {
            console.error("Erro ao buscar favoritos:", error);
        }
    }
    function renderizarFavoritos(favoritos) {
        containerCards.innerHTML = "";

        favoritos.forEach(favorito => {
            const prato = {
                id: favorito.id.produto,
                nome: favorito.produto.nome,
                descricao: favorito.descricao || 'Sem descrição',
                preco: favorito.produto.preco,
                imagem: `../../assets/${favorito.produto.nome.toLowerCase()}.png`,
                favorito: favorito.favorito
            };
            adicionarCard(prato, containerCards);
        });
    }

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
                    <button class="botao-carrinho"><img src="../../assets/carrinho-carrinho-branco.png" alt="Ícone carrinho"></button>
                    <button class="botao-lixo"><img src="../../assets/Trash.png" alt="Ícone de lixo"></button>
                </div>
            </div>
        `;

        const botaoLixo = card.querySelector('.botao-lixo');
        botaoLixo.addEventListener('click', () => removerFavorito(favorito));

        container.appendChild(card);
    }

    async function removerFavorito(favorito) {
        const url = `${ambiente.local + prefix.avaliacoes}`;
        const request = new Request({
            method: 'DELETE',
            newQueryStringParams: { usuario: userId, produto: favorito.id }
        });

        try {
            await new FetchBuilder().request(url, request);
            buscarFavoritos(); 
        } catch (error) {
            console.error("Erro ao remover favorito:", error);
        }
    }

    await buscarFavoritos();
});
