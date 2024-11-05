document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:8080/pedidos/kanban";
    const UPDATE_STATUS_URL = "http://localhost:8080/estado-pedido-historico";

    const pedidosSolicitadosContainer = document.querySelector(".order-list.solicitados");
    const pedidosEmPreparoContainer = document.querySelector(".order-list.em-preparo");
    const pedidosEmEntregaContainer = document.querySelector(".order-list.em-entrega");

    const contadorSolicitados = document.querySelector(".status-overview .status-card:nth-child(1) .counter");
    const contadorEmPreparo = document.querySelector(".status-overview .status-card:nth-child(2) .counter");
    const contadorEmEntrega = document.querySelector(".status-overview .status-card:nth-child(3) .counter");

    function criarCardPedido(pedido) {
        const card = document.createElement("div");
        card.classList.add("order-card");

        const pedidoId = document.createElement("p");
        pedidoId.classList.add("order-id");
        pedidoId.textContent = pedido.id;
        card.appendChild(pedidoId);

        const produtosContainer = document.createElement("span");
        produtosContainer.classList.add("produtos-container");

        let valorTotalPedido = 0;
        pedido.produtos.forEach(produto => {
            const produtoContainer = document.createElement("div");
            produtoContainer.classList.add("produto-container");
        
            const produtoInfo = document.createElement("p");
            produtoInfo.textContent = `${produto.quantidade}x ${produto.nome}`;
            produtoContainer.appendChild(produtoInfo);
        
            const botao1 = document.createElement("button");
            botao1.classList.add("confirmar");
            produtoContainer.appendChild(botao1);
        
            const botao2 = document.createElement("button");
            botao2.classList.add("deletar");
            produtoContainer.appendChild(botao2);

            botao1.addEventListener("click", () => confirmarEntrega(produto, produtoInfo));
            botao2.addEventListener("click", () => deletarProduto(produto, produtoContainer));
        
            produtosContainer.appendChild(produtoContainer);
        
            const valorProduto = produto.quantidade * produto.valor;
            valorTotalPedido += valorProduto;
        
            if (produto.observacao) {
                const observacao = document.createElement("p");
                observacao.innerHTML = `<strong>OBS:</strong> ${produto.observacao}`;
                produtosContainer.appendChild(observacao);
            }

            if(produto.entregue) {
                produtoInfo.style.textDecoration = "line-through";
                produtoInfo.style.color = "#a0a0a0";
            }

        });
        

        const valorTotalElement = document.createElement("p");
        valorTotalElement.classList.add("order-total");
        valorTotalElement.innerHTML = `<strong>Valor Total:</strong> R$ ${valorTotalPedido.toFixed(2)}`;
        produtosContainer.appendChild(valorTotalElement);

        const localizacao = document.createElement("p");
        if (pedido.tipoEntrega === "Presencial") {
            localizacao.innerHTML = `<strong>Nº da Mesa:</strong> <input type="number" value="${pedido.numeroMesa || ''}" readonly>`;
        } else if (pedido.tipoEntrega === "Balcão") {
            localizacao.textContent = "Retirada no Balcão";
        } else if (pedido.tipoEntrega === "Entrega") {
            localizacao.innerHTML = `<strong>Endereço:</strong> ${pedido.endereco.rua}, ${pedido.endereco.bairro}, ${pedido.endereco.numero} ${pedido.endereco.complemento ? `- ${pedido.endereco.complemento}` : ''}`;
        }
        produtosContainer.appendChild(localizacao);

        card.appendChild(produtosContainer);

        const botoesContainer = document.createElement("span");
        botoesContainer.classList.add("botoes-container");

        const cancelarButton = document.createElement("button");
        cancelarButton.classList.add("cancel");
        cancelarButton.textContent = "Cancelar";
        cancelarButton.addEventListener("click", () => mostrarPopupCancelar(pedido.id, card));
        botoesContainer.appendChild(cancelarButton);

        const editarButton = document.createElement("button");
        editarButton.classList.add("edit");
        cancelarButton.addEventListener("click", () => mostrarPopupCancelar(pedido.id, card));
        botoesContainer.appendChild(editarButton);

        if (pedido.estado === "Pedido em espera") {
            const aceitarButton = document.createElement("button");
            aceitarButton.classList.add("accept");
            aceitarButton.textContent = "Aceitar";
            aceitarButton.addEventListener("click", () => atualizarEstadoPedido(pedido.id, "Pedido em preparo", card));
            botoesContainer.appendChild(aceitarButton);
        } else if (pedido.estado === "Pedido em preparo") {
            const feitoButton = document.createElement("button");
            feitoButton.classList.add("done");
            feitoButton.textContent = "Feito";
            feitoButton.addEventListener("click", () => atualizarEstadoPedido(pedido.id, "Pedido a caminho", card));
            botoesContainer.appendChild(feitoButton);
        } else if (pedido.estado === "Pedido a caminho") {
            const entregueButton = document.createElement("button");
            entregueButton.classList.add("deliver");
            entregueButton.textContent = "Entregue";
            entregueButton.addEventListener("click", () => atualizarEstadoPedido(pedido.id, "Pedido entregue", card));
            botoesContainer.appendChild(entregueButton);
        }

        card.appendChild(botoesContainer);
        return card;
    }

    function mostrarPopupCancelar(pedidoId, card) {
        const popup = document.getElementById("cancel-popup");
        popup.style.display = "flex"; 

        const confirmarButton = document.getElementById("confirmar-cancelamento");
        confirmarButton.onclick = () => {
            const motivo = document.getElementById("motivo-cancelamento").value;

            if (motivo) {
                cancelarPedido(pedidoId, card, motivo);
                popup.style.display = "none"; 
            } else {
                alert("Motivo de cancelamento é necessário.");
            }
        };

        const cancelarButton = document.getElementById("cancelar-cancelamento");
        cancelarButton.onclick = () => {
            popup.style.display = "none"; 
        };
    }

    function atualizarEstadoPedido(pedidoId, novoEstado, card) {
        fetch(UPDATE_STATUS_URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                estado: novoEstado,
                pedido: pedidoId
            })
        })
            .then(response => {
                if (response.ok) {
                    if (novoEstado === "Pedido em preparo") {
                        pedidosSolicitadosContainer.removeChild(card);
                        pedidosEmPreparoContainer.appendChild(card);
                    } else if (novoEstado === "Pedido a caminho") {
                        pedidosEmPreparoContainer.removeChild(card);
                        pedidosEmEntregaContainer.appendChild(card);
                    } else if (novoEstado === "Pedido entregue") {
                        pedidosEmEntregaContainer.removeChild(card);
                    }

                    if (novoEstado === "Pedido em preparo") {
                        contadorSolicitados.textContent = parseInt(contadorSolicitados.textContent) - 1;
                        contadorEmPreparo.textContent = parseInt(contadorEmPreparo.textContent) + 1;
                    } else if (novoEstado === "Pedido a caminho") {
                        contadorEmPreparo.textContent = parseInt(contadorEmPreparo.textContent) - 1;
                        contadorEmEntrega.textContent = parseInt(contadorEmEntrega.textContent) + 1;
                    } else if (novoEstado === "Pedido entregue") {
                        contadorEmEntrega.textContent = parseInt(contadorEmEntrega.textContent) - 1;
                    }

                    location.reload();
                } else {
                    console.error("Erro ao atualizar o estado do pedido");
                }
            })
            .catch(error => console.error("Erro na requisição:", error));
    }

    function cancelarPedido(pedidoId, card, motivo) {
        fetch(UPDATE_STATUS_URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                estado: "Pedido cancelado",
                pedido: pedidoId,
                motivoCancelamento: motivo
            })
        })
            .then(response => {
                if (response.ok) {
                    card.remove();

                    contadorSolicitados.textContent = parseInt(contadorSolicitados.textContent) - 1;

                    location.reload();
                } else {
                    console.error("Erro ao cancelar o pedido");
                }
            })
            .catch(error => console.error("Erro na requisição:", error));
    }

    function atualizarPedidos(pedidos) {
        if (!pedidos || !Array.isArray(pedidos)) {
            console.error("A propriedade 'pedidos' não está definida ou não é um array:", pedidos);
            return;
        }

        let countSolicitados = 0;
        let countEmPreparo = 0;
        let countEmEntrega = 0;

        pedidos.forEach(pedido => {
            const card = criarCardPedido(pedido);

            if (pedido.estado === "Pedido em espera") {
                pedidosSolicitadosContainer.appendChild(card);
                countSolicitados++;
            } else if (pedido.estado === "Pedido em preparo") {
                pedidosEmPreparoContainer.appendChild(card);
                countEmPreparo++;
            } else if (pedido.estado === "Pedido a caminho") {
                pedidosEmEntregaContainer.appendChild(card);
                countEmEntrega++;
            }
        });

        contadorSolicitados.textContent = countSolicitados;
        contadorEmPreparo.textContent = countEmPreparo;
        contadorEmEntrega.textContent = countEmEntrega;
    }

    function obterPedidos() {
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao obter pedidos");
                }
                return response.json();
            })
            .then(data => {
                console.log(data); 
                if (Array.isArray(data)) { 
                    atualizarPedidos(data); 
                } else {
                    console.error("A resposta da API não é uma lista de pedidos:", data);
                }
            })
            .catch(error => console.error("Erro na requisição:", error));
    }



    obterPedidos();
});

function confirmarEntrega(produto, produtoElement) {
    const idPedidoUnitario = produto.idPedidoUnitario;

    const dados = {
        id: idPedidoUnitario,
        entregue: true
    };

    fetch('http://localhost:8080/pedido-unitario', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => {
        if (response.ok) {
            produtoElement.style.textDecoration = "line-through";
            produtoElement.style.color = "#a0a0a0";

            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else {
            console.error(`Erro ao confirmar entrega para o produto ${produto.nome}.`);
        }
    })
    .catch(error => console.error('Erro na requisição:', error));
}

function deletarProduto(produto) {
    const idPedidoUnitario = produto.idPedidoUnitario;

    const dados = {

    }
}

function deletarProduto(produto, produtoElement) {
    const idPedidoUnitario = produto.idPedidoUnitario;

    fetch(`http://localhost:8080/pedidos/deletar-produto/${idPedidoUnitario}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            produtoElement.remove();

            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else {
            console.error(`Erro ao deletar o produto com ID ${idPedidoUnitario}.`);
        }
    })
    .catch(error => console.error('Erro na requisição:', error));
}
