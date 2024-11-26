function updateDateTime() {
    const now = new Date();
    const daysOfWeek = ["DOMINGO", "SEGUNDA-FEIRA", "TERÇA-FEIRA", "QUARTA-FEIRA", "QUINTA-FEIRA", "SEXTA-FEIRA", "SÁBADO"];
    const day = daysOfWeek[now.getDay()];
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const dateTimeString = `${day}, ${hours}:${minutes}`;
    document.getElementById('date-time').textContent = dateTimeString;
}

setInterval(updateDateTime, 1000);
updateDateTime();

document.addEventListener("DOMContentLoaded", () => {
    function carregarPedidos() {
        fetch("http://localhost:8080/pedidos/kanban")
            .then(response => response.json())
            .then(data => {
                document.getElementById("pedidosEntrega").innerHTML = "";
                document.getElementById("pedidosMesa").innerHTML = "";
                document.getElementById("pedidosBalcao").innerHTML = "";

                const pedidosEmPreparo = data.filter(pedido => pedido.estado === "Pedido em preparo" || pedido.estado === "Produto adicionado ao pedido, em preparo");

                pedidosEmPreparo.forEach(pedido => {
                    const pedidoCard = criarCardPedido(pedido);

                    if (pedido.tipoEntrega === "Entrega") {
                        document.getElementById("pedidosEntrega").appendChild(pedidoCard);
                    } else if (pedido.tipoEntrega === "Presencial") {
                        document.getElementById("pedidosMesa").appendChild(pedidoCard);
                    } else if (pedido.tipoEntrega === "Balcão") {
                        document.getElementById("pedidosBalcao").appendChild(pedidoCard);
                    }
                });
            })
            .catch(error => console.error("Erro ao buscar pedidos:", error));
    }

    function criarCardPedido(pedido) {
        const card = document.createElement("div");
        card.classList.add("order-card");

        const orderId = document.createElement("p");
        orderId.classList.add("order-id");
        orderId.textContent = pedido.id;
        card.appendChild(orderId);

        const preparoHistorico = pedido.estadoPedidoHistorico.find(
            estado => estado.estado === "Pedido em preparo" || estado.estado === "Produto adicionado ao pedido, em preparo"
        );
        if (preparoHistorico) {
            const horaPreparo = document.createElement("p");
            horaPreparo.classList.add("hora-preparo");
            horaPreparo.textContent = `Horário do pedido: ${new Date(preparoHistorico.hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            card.appendChild(horaPreparo);
        }

        const produtosContainer = document.createElement("span");
        produtosContainer.classList.add("produtos-container");

        pedido.produtos.forEach(produto => {
            const produtoInfo = document.createElement("p");

            if (produto.entregue) {
                produtoInfo.style.textDecoration = "line-through";
                produtoInfo.style.color = "#a0a0a0";
            }

            produtoInfo.textContent = `${produto.quantidade}x ${produto.nome}`;
            produtosContainer.appendChild(produtoInfo);

            if (produto.observacao) {
                const observacaoInfo = document.createElement("p");
                observacaoInfo.innerHTML = `<strong>OBS:</strong> ${produto.observacao}`;
                produtosContainer.appendChild(observacaoInfo);
            }
        });

        card.appendChild(produtosContainer);

        return card;
    }

    carregarPedidos();
});
