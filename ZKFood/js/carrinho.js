// Dados mockados para teste
const mockData = [
    { 
        id: 1, 
        nome: 'Produto A', 
        valor: 29.99,
        descricao: 'Descrição do produto A',
        qtdPessoas: 2,
        imagem: '../../assets/prato-feijoada-Zeca.png'
    },
    { 
        id: 2, 
        nome: 'Produto B', 
        valor: 39.99,
        descricao: 'Descrição do produto B',
        qtdPessoas: 1,
        imagem: '../../assets/prato-feijoada-Zeca.png'
    },
    { 
        id: 3, 
        nome: 'Produto C', 
        valor: 49.99,
        descricao: 'Descrição do produto C',
        qtdPessoas: 2,
        imagem: '../../assets/prato-feijoada-Zeca.png'
    }
];
sessionStorage.setItem('PRODUTOS_CARRINHO', JSON.stringify(mockData));
document.addEventListener("DOMContentLoaded", function() {
    const listaCardapio = document.querySelector('.lista');
    const containerFavoritos = document.querySelector('.container-cards');
    
    // Inicializa o carrinho no sessionStorage se não existir
    if (!sessionStorage.getItem('PRODUTOS_CARRINHO')) {
        sessionStorage.setItem('PRODUTOS_CARRINHO', JSON.stringify(mockData));
    }

    // Inicializa as quantidades do carrinho no sessionStorage se não existir
    if (!sessionStorage.getItem('CARRINHO_QUANTIDADES')) {
        sessionStorage.setItem('CARRINHO_QUANTIDADES', JSON.stringify({}));
    }

    // Map para controlar quantidades no carrinho
    let carrinhoItems = new Map(Object.entries(JSON.parse(sessionStorage.getItem('CARRINHO_QUANTIDADES') || '{}')));

    function getProdutosFromSession() {
        return JSON.parse(sessionStorage.getItem('PRODUTOS_CARRINHO') || '[]');
    }

    function salvarCarrinhoNoSession() {
        // Converte o Map para objeto antes de salvar
        const carrinhoObj = Object.fromEntries(carrinhoItems);
        sessionStorage.setItem('CARRINHO_QUANTIDADES', JSON.stringify(carrinhoObj));
    }

    function renderizarCardapio() {
        const produtos = getProdutosFromSession();
        listaCardapio.innerHTML = '';
        
        produtos.forEach(produto => {
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
                salvarCarrinhoNoSession(); // Salva após atualizar quantidade
                atualizarResumo();
            }
        }
    }

    function adicionarAoCarrinho(produtoId) {
        const quantidade = carrinhoItems.get(produtoId) || 0;
        carrinhoItems.set(produtoId, quantidade + 1);
        salvarCarrinhoNoSession(); // Salva após adicionar ao carrinho
        renderizarCardapio();
        atualizarResumo();
    }

    function removerDoCarrinho(produtoId) {
        // Remover o item do Map
        carrinhoItems.delete(produtoId);
        
        // Atualiza o sessionStorage para remover o produto do carrinho
        const produtos = getProdutosFromSession();
        const produtosAtualizados = produtos.filter(produto => produto.id !== parseInt(produtoId));
        
        // Salva a lista atualizada de produtos no sessionStorage
        sessionStorage.setItem('PRODUTOS_CARRINHO', JSON.stringify(produtosAtualizados));
        
        salvarCarrinhoNoSession(); // Salva após remover do carrinho
        renderizarCardapio();
        atualizarResumo();
    }

    function atualizarResumo() {
        const listaPedidos = document.querySelector('.lista-pedidos');
        listaPedidos.innerHTML = '';
        
        const produtos = getProdutosFromSession();
        let total = 0;

        for (const [produtoId, quantidade] of carrinhoItems) {
            const produto = produtos.find(p => p.id === parseInt(produtoId));
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
    renderizarCardapio();
    atualizarResumo();
});