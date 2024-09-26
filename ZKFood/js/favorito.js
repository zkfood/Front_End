document.addEventListener("DOMContentLoaded", function() {
    // Exemplo de JSON chumbado (pode substituir pelo resultado do fetch mais tarde)
    const favoritos = [
        {
            "nome": "Prato de Feijoada",
            "descricao": "Feijoada completa, acompanhada de arroz, farofa e couve.",
            "preco": 27.00,
            "imagem": "../../assets/prato-feijoada-Zeca.png",
            "favorito": true
        },
        {
            "nome": "Prato de Strogonoff",
            "descricao": "Strogonoff de frango, acompanhado de arroz e batata palha.",
            "preco": 23.50,
            "imagem": "../../assets/prato-strogonoff.png",
            "favorito": true
        }
    ];

    // Função para renderizar os favoritos no container de cards
    function renderizarFavoritos(favoritos) {
        const containerCards = document.querySelector('.container-cards');

        // Limpa o conteúdo atual (se precisar)
        containerCards.innerHTML = "";

        // Adiciona cada favorito como um novo card
        favoritos.forEach(favorito => {
            adicionarCard(favorito, containerCards);
        });
    }

    // Função para adicionar um card ao container de favoritos
    function adicionarCard(favorito, container) {
        // Cria o elemento do card
        const card = document.createElement('div');
        card.classList.add('card');

        // Adiciona o conteúdo do card
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

        // Adiciona o card ao container
        container.appendChild(card);
    }

    // Inicializa a renderização com os dados chumbados
    renderizarFavoritos(favoritos);
});
