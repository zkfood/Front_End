const idUsuario = sessionStorage.getItem('idUsuario');

const mes = {
    1: "Janeiro",
    2: "Fevereiro",
    3: "Março",
    4: "Abril",
    5: "Maio",
    6: "Junho",
    7: "Julho",
    8: "Agosto",
    9: "Setembro",
    10: "Outubro",
    11: "Novembro",
    12: "Dezembro"
}


async function carregarPedidos(paginacao) {
    const divPaginasPaginacao = document.getElementById('paginasPaginacao');
    divPaginasPaginacao.innerHTML = '';

    const parametros = !paginacao ? new Request({
        newQueryStringParams: {
            idUsuario,
        }
    }) : new Request({
        newQueryStringParams: {
            idUsuario,
            pagina: paginacao
        }
    });

    const resposta = await new FetchBuilder().request(`${ambiente.local + prefix.pedidos}`, parametros);
    const pedidos = resposta.pedidos;
    const div = document.getElementById('divHistoricoPedidos');

    div.innerHTML = `<h2><span>Histórico</span> de Pedidos</h2>`;

    if (!pedidos || pedidos.length === 0) {
        div.innerHTML += `
            <div class="container-semPedido">
                <div class="card-semPedido">
                    <h1>Você não tem pedidos <span>:(</span></h1>
                    <p>Oops, parece que você ainda não fez nenhum pedido.</p>
                    <br>
                    <p>Não perca tempo e faça seu pedido agora!</p>
                    <a class="botao-azul" href="./cardapio.html">Acessar cardápio</a>
                </div>
            </div>
        `;
        return;
    }

    pedidos.forEach(item => {
        const data = new Date(item.estadoPedidoHistorico[0].hora);
        const status = item.estado === "Pedido entregue"
            ? "<div class='status-pedido concluido'>✅ Concluído</div>"
            : item.estado === "Pedido cancelado"
                ? "<div class='status-pedido cancelado'>❌ Cancelado</div>"
                : "<div class='status-pedido em-andamento'>🍳 Em Andamento</div>";
                
        div.innerHTML += `
            <div class="data-pedido">${data.getDate()} de ${mes[data.getMonth()]} de ${data.getFullYear()}</div>
            <div class="pedido-card">
                <div class="pedido-info" id="pedidoInfo-${item.id}">
                    ${status}
                </div>
                <button class="comprar-novamente" onclick="verDetalhes(${item.id})">Ver Detalhes</button>
            </div>
        `;
    });

    pedidos.forEach(item => {
        const pedidoInfo = document.getElementById(`pedidoInfo-${item.id}`);
        let valorTotal = 0;

        item.produtos.map(produto => {
            valorTotal += produto.quantidade * produto.valor;
            pedidoInfo.innerHTML += `<div class="item-pedido">${produto.quantidade}x ${produto.nome}</div>`;
        });

        if (item.tipoEntrega === 'Entrega') {
            pedidoInfo.innerHTML += `<div class="item-pedido">Delivery</div>`;
            valorTotal += 3;
        }

        pedidoInfo.innerHTML += `<div class="valor-pedido">R$ ${valorTotal.toFixed(2)}</div>`;
    });

    const totalDePaginas = resposta.paginacao.totalDePaginas;
    for (let i = 1; i <= totalDePaginas; i++) {
        const button = document.createElement("button");
        button.innerText = i;
        button.onclick = () => {
            carregarPedidos(i);
            marcarBotaoAtivo(i);
        };

        if (i === paginacao) {
            button.classList.add("active");
        }

        divPaginasPaginacao.appendChild(button);
    }
}

// Função para marcar o botão ativo
function marcarBotaoAtivo(paginaAtual) {
    const botoes = document.querySelectorAll('.paginacao button');
    botoes.forEach((botao, index) => {
        if (index + 1 === paginaAtual) {
            botao.classList.add('active');
        } else {
            botao.classList.remove('active');
        }
    });
}


window.onload = async function () {
    await carregarPedidos();
}

function verDetalhes(id){
    sessionStorage.setItem('PEDIDO_DETALHES', id);
    window.location = './statusPedido.html';
}