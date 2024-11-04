const mockData = [
    { id: 1, qtd: 2, observacao: "Com canudo" },
    { id: 2, qtd: 3, observacao: "Com canudo" },
    { id: 7, qtd: 2, observacao: "aaaa" },
];
sessionStorage.setItem('PRODUTOS_CARRINHO', JSON.stringify(mockData));

document.addEventListener("DOMContentLoaded", async function() {
    const listaCardapio = document.querySelector('.lista');
    let carrinhoItems = new Map(Object.entries(JSON.parse(sessionStorage.getItem('CARRINHO_QUANTIDADES') || '{}')));

    function getProdutosFromSession() {
        return JSON.parse(sessionStorage.getItem('PRODUTOS_CARRINHO') || '[]');
    }

    function salvarCarrinhoNoSession() {
        const carrinhoObj = Object.fromEntries(carrinhoItems);
        sessionStorage.setItem('CARRINHO_QUANTIDADES', JSON.stringify(carrinhoObj));
    }

    async function buscarDadosProduto(id) {
        const url = `${ambiente.local + prefix.produtos}/${id}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                return await response.json();
            } else {
                console.error(`Erro ao buscar produto ${id}`);
                return null;
            }
        } catch (error) {
            console.error(`Erro de conexão ao buscar produto ${id}:`, error);
            return null;
        }
    }

    async function buscarProdutosParaExibicao() {
        const produtosNoCarrinho = getProdutosFromSession();
        const promises = produtosNoCarrinho.map(produto => buscarDadosProduto(produto.id));
        return await Promise.all(promises);
    }

    async function renderizarCardapio() {
        const produtos = await buscarProdutosParaExibicao();
        listaCardapio.innerHTML = '';

        produtos.forEach((produto, index) => {
            if (!produto) return;
            const quantidade = carrinhoItems.get(produto.id.toString()) || 0;
            const cardHtml = `
                <div class="card-cardapio" data-id="${produto.id}">
                    <div class="conteudo-cardapio">
                        <h2>${produto.nome}</h2>
                        <p>${produto.descricao}</p>
                        <div class="servir">
                            <img src="../../assets/icons-usuário-cinza.png" alt="icone de usuario">
                            <h5>Serve ${produto.qtdPessoas} pessoas</h5>
                        </div>
                        <h1><span>R$</span>${produto.valor.toFixed(2)}</h1>
                    </div>
                    <div class="imagem-cardapio">
                        <img src="${produto.imagem}" alt="Foto do prato">
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

        adicionarEventosCardapio();
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

    function atualizarQuantidade(produtoId, delta, input) {
        let valorAtual = parseInt(input.value) || 0;
        let novoValor = valorAtual + delta;

        if (novoValor >= 0 && novoValor <= 99) {
            input.value = novoValor;
            if (novoValor === 0) {
                removerDoCarrinho(produtoId);
            } else {
                carrinhoItems.set(produtoId, novoValor);
                salvarCarrinhoNoSession();
                atualizarResumo();
            }
        }
    }

    function removerDoCarrinho(produtoId) {
        carrinhoItems.delete(produtoId);

        const produtos = getProdutosFromSession();
        const produtosAtualizados = produtos.filter(produto => produto.id !== parseInt(produtoId));
        sessionStorage.setItem('PRODUTOS_CARRINHO', JSON.stringify(produtosAtualizados));
        
        salvarCarrinhoNoSession();
        renderizarCardapio();
        atualizarResumo();
    }

    async function atualizarResumo() {
        const listaPedidos = document.querySelector('.lista-pedidos');
        listaPedidos.innerHTML = '';
        
        const produtos = getProdutosFromSession();
        let total = 0;

        for (const [produtoId, quantidade] of carrinhoItems) {
            const produto = await buscarDadosProduto(produtoId);
            if (produto) {
                const subtotal = produto.valor * quantidade;
                total += subtotal;

                listaPedidos.insertAdjacentHTML('beforeend', `
                    <div class="item">
                        <p>${quantidade}x ${produto.nome}</p>
                        <p>R$ ${subtotal.toFixed(2)}</p>
                    </div>
                `);
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

    // Inicialização
    await renderizarCardapio();
    atualizarResumo();
});