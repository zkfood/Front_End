const idUsuario = sessionStorage.getItem('idUsuario');

async function receberPratos(tipo) {
    const buscarFavoritos = async () => {
        const url = `${ambiente.local + prefix.avaliacoes}`;
        const request = new Request({
            newQueryStringParams: { favorito: true, usuario: idUsuario },
        });

        try {
            return await new FetchBuilder().request(url, request);
        } catch (error) {
            console.error("Erro ao buscar favoritos:", error);
        }
    };

    const favoritos = await buscarFavoritos();

    const divItensCardapio = document.getElementById('itensCardapio');
    divItensCardapio.innerHTML = '';

    const url = `${ambiente.local + prefix.produtos}`;
    const chamada = tipo
        ? new Request({
            newQueryStringParams: {
                tipo: tipo,
            },
        })
        : undefined;

    const fetch = await new FetchBuilder().request(url, chamada);

    // Recupera a pesquisa armazenada no localStorage
    const pesquisa = localStorage.getItem('searchQuery')?.toLowerCase() || '';

    var linhaItemCardapio = document.createElement('div');
    linhaItemCardapio.className = 'linha-item-cardapio';
    divItensCardapio.appendChild(linhaItemCardapio);

    var contador = 0;
    fetch.map(produto => {
        // Verifica se o produto corresponde à pesquisa ou se não há pesquisa
        const correspondePesquisa = pesquisa === '' || produto.nome.toLowerCase().includes(pesquisa);

        if (produto.disponibilidade && correspondePesquisa) {
            if (contador % 2 === 0 && contador !== 0) {
                linhaItemCardapio = document.createElement('div');
                linhaItemCardapio.className = 'linha-item-cardapio';
                divItensCardapio.appendChild(linhaItemCardapio);
            }

            const favorito = favoritos.find(item => item.produto.id === produto.id);
            const corBotao = favorito ? "botao-favoritos red" : "botao-favoritos";

            linhaItemCardapio.innerHTML += `
                <div class="card-cardapio">
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
                        <img id="imagem-${produto.descricao}" src="${ambiente.local + prefix.produtos}/imagem/${produto.id}" alt="Foto do prato">
                        <div class="menu-card">
                            <button class="botao-acessar" onclick="abrirModal(${produto.id})" id="openModal-${produto.id}">Ver mais</button>
                            <button class="${corBotao}" onclick="favoritar(${produto.id})"><img src="../../assets/icon-coração-branco.png" alt=""></button>
                        </div>
                    </div>
                </div>
            `;
            contador++;
        }
    });
}


async function favoritar(id) {
    await fetch(`${ambiente.local + prefix.avaliacoes}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario: idUsuario,
            produto: id,
            favorito: true,
        })
    })
    exibirPopup("Adicionado aos favoritos!", "success");

    setTimeout(() => {
        window.location = "./cardapio.html";
    }, 2000); // 3000 milissegundos = 3 segundos

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

sessionStorage.setItem('PRODUTO_ATUAL_MODAL', 0)

function abrirModal(id) {
    sessionStorage.setItem('PRODUTO_ATUAL_MODAL', id)

    const openModal = document.getElementById(`openModal-${id}`);
    const closeModal = document.getElementById('closeModal');
    const modalBackground = document.getElementById('modalBackground');

    openModal.addEventListener('click', async () => {
        modalBackground.style.display = 'flex';
        const produtoAtualModal = sessionStorage.getItem('PRODUTO_ATUAL_MODAL');

        const produto = await new FetchBuilder().request(`${ambiente.local}${prefix.produtos}/${produtoAtualModal}`);

        const nome = document.getElementById('card-nome')
        const imagem = document.getElementById('card-imagem')
        const descricao = document.getElementById('card-descricao')

        nome.innerHTML = produto.nome;
        imagem.src = `${ambiente.local}${prefix.produtos}/imagem/${produto.id}`;
        descricao.innerHTML = produto.descricao;
    });

    openModal.click();

    closeModal.addEventListener('click', () => {
        modalBackground.style.display = 'none';
        sessionStorage.setItem('PRODUTO_ATUAL_MODAL', 0)
    });

    window.addEventListener('click', (event) => {
        if (event.target === modalBackground) {
            modalBackground.style.display = 'none';
        }
    });
}

function comprarAgora() {
    baseAdicionarCarrinho();
    window.location = './carrinho.html';
}

function adicionarAoCarrinho() {
    baseAdicionarCarrinho();
    exibirPopup("O produto foi adicionado ao carrinho!", "success")
}

function baseAdicionarCarrinho() {
    const inputQuantidade = document.getElementById('input-quantidade');
    const observacao = document.getElementById('observacao');

    const produtosCarrinho = sessionStorage.getItem('PRODUTOS_CARRINHO');

    if (produtosCarrinho == null) {
        sessionStorage.setItem('PRODUTOS_CARRINHO', JSON.stringify([]));
    }

    const carrinho = JSON.parse(sessionStorage.getItem('PRODUTOS_CARRINHO'));
    const idProduto = sessionStorage.getItem('PRODUTO_ATUAL_MODAL')

    carrinho.push({ id: idProduto, quantidade: inputQuantidade.value, observacao: observacao.value });

    sessionStorage.setItem('PRODUTOS_CARRINHO', JSON.stringify(carrinho));
}