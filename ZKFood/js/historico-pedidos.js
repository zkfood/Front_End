const idUsuario = sessionStorage.getItem('IdUsuario');

async function carregarPedidos() {
    const parametros = new Request({
        newQueryStringParams: {
            idUsuario: idUsuario
        }
    })

    const pedidos = await new FetchBuilder().request(`${ambiente.local + prefix.pedidos}`, parametros)

    const div = document.getElementById('divHistoricoPedidos');

    pedidos.map(
        item => {
            div.innerHTML += `
                <div class="data-pedido">10 de Outubro de 2024</div>
                <div class="pedido-card">
                    <div class="pedido-info">
                        <div class="status-pedido concluido">✅ Concluído</div>
                        ${item.produtos.map(
                            produto => {
                                this.innerHTML += `<div class="item-pedido">${produto.quantidade}x ${produto.nome}</div>`;
                            }
                        )}                        
                        <div class="valor-pedido">R$ 39,90</div>
                    </div>
                    <button class="comprar-novamente">Comprar Novamente</button>
                </div>
            `;
        }
    )
}
// 🍳 Em Andamento

carregarPedidos();