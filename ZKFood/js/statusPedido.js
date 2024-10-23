document.addEventListener("DOMContentLoaded", async function() {
    const statusOverview = document.getElementById('statusOverview');
    const pedidoDetalhes = document.getElementById('pedidoDetalhes');
    const semPedidos = document.getElementById('semPedidos');

    async function buscarPedidos() {
        const idUsuario = 1; 
        const url = `${ambiente.local}pedidos?idUsuario=${idUsuario}`;
        
        try {
            const pedidos = await new FetchBuilder().request(url);
            renderizarPedidos(pedidos);
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
            exibirErro();
        }
    }

    function renderizarPedidos(pedidos) {
        statusOverview.innerHTML = "";
        pedidoDetalhes.innerHTML = "";

        if (!pedidos.length) {
            semPedidos.style.display = 'block';
            return;
        }

        pedidos.forEach(pedido => {
            const statusHtml = `
                <div class="status-card">
                    <img src="../../assets/Check Mark.png" alt="Pedido Aceito">
                    <p>${pedido.estado}</p>
                </div>`;
            statusOverview.innerHTML += statusHtml;

            const detalhesHtml = `
                <div class="card-item">
                    <div class="card-cardapio">
                        <div class="conteudo-cardapio">
                            <h2>${pedido.produtos[0].nome}</h2>
                            <p>${pedido.produtos[0].descricao}</p>
                            <h1><span>R$</span>${pedido.produtos[0].valor.toFixed(2)}</h1>
                        </div>
                        <div class="imagem-cardapio">
                            <img src="${ambiente.local}produtos/imagem/${pedido.produtos[0].id}" alt="Imagem do prato">
                        </div>
                    </div>
                </div>`;
            pedidoDetalhes.innerHTML += detalhesHtml;
        });
    }

    // Função para exibir erro quando o pedido falhar
    function exibirErro() {
        semPedidos.style.display = 'block';
        semPedidos.querySelector('h1').innerText = "Oops! Tivemos um problema com o seu pedido.";
        semPedidos.querySelector('p').innerText = "Por favor, tente novamente mais tarde.";
    }

    // Buscar os pedidos ao carregar a página
    await buscarPedidos();
});
