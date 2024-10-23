document.addEventListener("DOMContentLoaded", async function() {
    const listaCardapio = document.querySelector('.lista');
    const containerFavoritos = document.querySelector('.container-cards');
    
    let carrinhoItems = new Map();

    async function receberPratos() {
        const url = `${ambiente.local+prefix.produtos}`;
        try {
            const fetch = await new FetchBuilder().request(url);
            renderizarCardapio(fetch);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    }

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

    function renderizarCardapio(produtos) {
        listaCardapio.innerHTML = '';
        produtos.forEach(produto => {
            const quantidade = carrinhoItems.get(produto.id) || 0;
            const cardHtml = `
                <div class="card-cardapio" data-id="${produto.id}">
                    <div class="conteudo-cardapio">
                        <h2>${produto.nome}</h2>
                        <p>${produto.descricao}</p>
                        <div class="servir">
                            <img src="../../assets/icons-usuário-cinza.png" alt="icone de usuario">
                            <h5>Serve ${produto.qtdPessoas} pessoas</h5>
                        </div>
                        <h1><span>R$</span>${produto.valor}</h1>
                    </div>
                    <div class="imagem-cardapio">
                        <img src="${ambiente.local+prefix.produtos}/imagem/${produto.id}" alt="Foto do prato">
                        <div class="menu-card">
                            <div class="seletor-quantidade">
                                <button class="diminuir">-</button>
                                <input value="${quantidade}" min="1" max="99" readonly>
                                <button class="aumentar">+</button>
                            </div>
                            <button class="botao-lixo">
                                <img src="../../assets/Trash.png" alt="icone de lixo">
                            </button>
                        </div>
                    </div>
                </div>
            `;
            listaCardapio.insertAdjacentHTML('beforeend', cardHtml);
        });
        
        // listener no botao
        adicionarEventosCardapio();
    }

    function renderizarFavoritos(favoritos) {
        containerFavoritos.innerHTML = '';
        favoritos.forEach(favorito => {
            const cardHtml = `
                <div class="card" data-id="${favorito.produto.id}">
                    <img class="img-prato" src="${ambiente.local+prefix.produtos}/imagem/${favorito.produto.id}" alt="foto do prato">
                    <h1>${favorito.produto.nome}</h1>
                    <p>${favorito.descricao || 'Sem descrição'}</p>
                    <div class="card-menu">
                        <h2><span>R$</span> ${favorito.produto.valor.toFixed(2)}</h2>
                        <div class="card-botoes">
                            <button class="botao-carrinho">
                                <img src="../../assets/carrinho-carrinho-branco.png" style="margin-right: 3px;" alt="icone de carrinho de compras">
                            </button>
                            <button class="botao-lixo">
                                <img src="../../assets/Trash.png" alt="icone de lixo">
                            </button>
                        </div>
                    </div>
                </div>
            `;
            containerFavoritos.insertAdjacentHTML('beforeend', cardHtml);
        });

        adicionarEventosFavoritos();
    }

    function adicionarEventosCardapio() {
        document.querySelectorAll('.seletor-quantidade').forEach(seletor => {
            const card = seletor.closest('.card-cardapio');
            const produtoId = card.dataset.id;
            const diminuir = seletor.querySelector('.diminuir');
            const aumentar = seletor.querySelector('.aumentar');
            const input = seletor.querySelector('input');
            const botaoLixo = card.querySelector('.botao-lixo');

            diminuir.addEventListener('click', () => atualizarQuantidade(produtoId, -1, input));
            aumentar.addEventListener('click', () => atualizarQuantidade(produtoId, 1, input));
            botaoLixo.addEventListener('click', () => removerDoCarrinho(produtoId));
        });
    }

    function adicionarEventosFavoritos() {
        document.querySelectorAll('.container-cards .card').forEach(card => {
            const produtoId = card.dataset.id;
            const botaoCarrinho = card.querySelector('.botao-carrinho');
            const botaoLixo = card.querySelector('.botao-lixo');

            botaoCarrinho.addEventListener('click', () => adicionarAoCarrinho(produtoId));
            botaoLixo.addEventListener('click', () => removerFavorito(produtoId));
        });
    }

    function atualizarQuantidade(produtoId, delta, input) {
        let valorAtual = parseInt(input.value) || 0;
        let novoValor = valorAtual + delta;

        if (novoValor >= 0 && novoValor <= 99) {
            input.value = novoValor;
            if (novoValor === 0) {
                removerDoCarrinho(produtoId);
            } else {
                carrinhoItems.set(produtoId, novoValor);
                atualizarResumo();
            }
        }
    }

    async function adicionarAoCarrinho(produtoId) {
        const quantidade = carrinhoItems.get(produtoId) || 0;
        carrinhoItems.set(produtoId, quantidade + 1);
        await receberPratos();
        atualizarResumo();
    }

    function removerDoCarrinho(produtoId) {
        carrinhoItems.delete(produtoId);
        receberPratos();
        atualizarResumo();
    }

    async function removerFavorito(produtoId) {
        const url = `${ambiente.local + prefix.avaliacoes}`;
        const request = new Request({
            method: 'DELETE',
            newQueryStringParams: { usuario: 1, produto: produtoId }
        });

        try {
            await new FetchBuilder().request(url, request);
            await buscarFavoritos();
        } catch (error) {
            console.error("Erro ao remover favorito:", error);
        }
    }

    async function atualizarResumo() {
        const listaPedidos = document.querySelector('.lista-pedidos');
        listaPedidos.innerHTML = '';
        
        let total = 0;
        for (const [produtoId, quantidade] of carrinhoItems) {
            const url = `${ambiente.local+prefix.produtos}/${produtoId}`;
            try {
                const produto = await new FetchBuilder().request(url);
                const subtotal = produto.valor * quantidade;
                total += subtotal;

                listaPedidos.insertAdjacentHTML('beforeend', `
                    <div class="item">
                        <p>${quantidade}x ${produto.nome}</p>
                        <p>R$ ${subtotal.toFixed(2)}</p>
                    </div>
                `);
            } catch (error) {
                console.error("Erro ao buscar detalhes do produto:", error);
            }
        }

        const taxaEntrega = 5.00;
        total += taxaEntrega;

        listaPedidos.insertAdjacentHTML('beforeend', `
            <div class="item">
                <p>Taxa de entrega</p>
                <p>R$ ${taxaEntrega.toFixed(2)}</p>
            </div>
            <div class="total">
                <p><b>Valor total</b></p>
                <h2>R$ ${total.toFixed(2)}</h2>
            </div>
            <a class="botao-azul" href="./endereco.html">Continuar</a>
        `);
    }

    await Promise.all([receberPratos(), buscarFavoritos()]);
    atualizarResumo();
});