document.addEventListener("DOMContentLoaded", () => {
    carregarCategorias('categoria_lista', 'produto_lista');
});

let pedidoId = null;
let pedidosIds = [];
const valoresKpi = {
    solicitado: 0,
    emPreparo: 0,
    emEntrega: 0
};

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
        console.log(pedido)
        const card = document.createElement("div");
        card.classList.add("order-card");

        const topoContainer = document.createElement("span");
        topoContainer.classList.add("topo-container");
        card.appendChild(topoContainer);

        const novoBotao = document.createElement("button");
        novoBotao.classList.add("editar-pedido");
        topoContainer.appendChild(novoBotao);

        topoContainer.appendChild(novoBotao);
        card.appendChild(topoContainer);

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
            botao1.style.display = "none";

            const botao2 = document.createElement("button");
            botao2.classList.add("deletar");
            produtoContainer.appendChild(botao2);
            botao2.style.display = "none";

            novoBotao.addEventListener("click", () => {
                botao1.style.display = botao1.style.display === "none" ? "inline-block" : "none";
                botao2.style.display = botao2.style.display === "none" ? "inline-block" : "none";
            });

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

            if (produto.entregue) {
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
        editarButton.textContent = "+";
        editarButton.addEventListener("click", () => abrirPopupEditar(pedido.id));
        botoesContainer.appendChild(editarButton);

        if (pedido.estado === "Pedido em espera") {
            const aceitarButton = document.createElement("button");
            aceitarButton.classList.add("accept");
            aceitarButton.textContent = "Aceitar";
            aceitarButton.addEventListener("click", () => atualizarEstadoPedido(pedido.id, "Pedido em preparo", card));
            botoesContainer.appendChild(aceitarButton);
        } else if (pedido.estado === "Pedido em preparo" || pedido.estado === "Produto adicionado ao pedido, em preparo") {
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

    async function validarPedidos() {
        if (!pedidosIds.length){
            try {
                const response = await fetch('http://localhost:8080/pedidos/kanban');
                
                if (!response.ok) {
                    throw new Error('Falha ao buscar pedidos');
                }
        
                const pedidos = await response.json();
                
                if (Array.isArray(pedidos)) {
                    pedidos.forEach(pedido => {
                        const idPedido = pedido.id;
        
                        if (!pedidosIds.includes(idPedido)) {
                            
                            if(pedido.estado == "Pedido em espera") {
                                valoresKpi.solicitado ++
                            } else if (pedido.estado == "Pedido em preparo" || pedido.estado == "Produto adicionado ao pedido, em preparo") {
                                valoresKpi.emPreparo ++
                            } else if (pedido.estado == "Pedido a caminho") {
                                valoresKpi.emEntrega ++
                            }

                            pedidosIds.push(idPedido);
                        }
                    });
                } else {
                    console.error("A resposta não é um array:", pedidos);
                }
            } catch (error) {
                console.error('Erro ao atualizar pedidos:', error);
            }
        } else {
            try {
                const response = await fetch('http://localhost:8080/pedidos/kanban');
                
                if (!response.ok) {
                    throw new Error('Falha ao buscar pedidos');
                }
        
                const pedidos = await response.json();
                
                if (Array.isArray(pedidos)) {
                    pedidos.forEach(pedido => {
                        const idPedido = pedido.id;
        
                        if (!pedidosIds.includes(idPedido)) {
                            if(pedido.estado == "Pedido em espera") {
                                valoresKpi.solicitado ++
                            } else if (pedido.estado == "Pedido em preparo" || pedido.estado == "Produto adicionado ao pedido, em preparo") {
                                valoresKpi.emPreparo ++
                            } else {
                                valoresKpi.emEntrega ++
                            }
                            pedidosIds.push(idPedido);

                            atualizarPedidos([pedido])
                        }
                    });
                } else {
                    console.error("A resposta não é um array:", pedidos);
                }
            } catch (error) {
                console.error('Erro ao atualizar pedidos:', error);
            }
        }
        
        console.log(pedidosIds)
    }
    

    setInterval(validarPedidos, 10000);

    validarPedidos();

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
                    if (novoEstado === "Pedido em preparo" || novoEstado === "Produto adicionado ao pedido, em preparo") {
                        pedidosSolicitadosContainer.removeChild(card);
                        pedidosEmPreparoContainer.appendChild(card);
                    } else if (novoEstado === "Pedido a caminho") {
                        pedidosEmPreparoContainer.removeChild(card);
                        pedidosEmEntregaContainer.appendChild(card);
                    } else if (novoEstado === "Pedido entregue") {
                        pedidosEmEntregaContainer.removeChild(card);
                    }

                    if (novoEstado === "Pedido em preparo" || novoEstado === "Produto adicionado ao pedido, em preparo") {
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
            } else if (pedido.estado === "Pedido em preparo" || pedido.estado === "Produto adicionado ao pedido, em preparo") {
                pedidosEmPreparoContainer.appendChild(card);
                countEmPreparo++;
            } else if (pedido.estado === "Pedido a caminho") {
                pedidosEmEntregaContainer.appendChild(card);
                countEmEntrega++;
            }
        });

        contadorSolicitados.textContent = valoresKpi.solicitado;
        contadorEmPreparo.textContent = valoresKpi.emPreparo;
        contadorEmEntrega.textContent = valoresKpi.emEntrega;
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

var popIdPedido = 0

function abrirPopupEditar(idPedido) {
    pedidoId = idPedido;  // Armazenamos o ID do pedido a ser editado
    const popupEditar = document.getElementById("popupEditar");

    console.log(idPedido)
    popIdPedido = idPedido

    // Exibe o popup
    popupEditar.style.display = "flex";

    // Carrega as categorias e produtos, e preenche os campos com os dados do pedido
    carregarCategorias('categoria_lista', 'produto_lista');
}

async function carregarCategorias(categoriaId, produtoId) {
    try {
        const resposta = await fetch("http://localhost:8080/tipo-produtos");
        const categorias = await resposta.json();
        const categoriaLista = document.getElementById(categoriaId);
        const categoriasExistentes = Array.from(categoriaLista.options).map(option => option.value);
        const categoriasFiltradas = categorias.filter(categoria => !categoriasExistentes.includes(categoria.id.toString()));
        categoriaLista.innerHTML += categoriasFiltradas.map(categoria => `<option value="${categoria.id}">${categoria.nome}</option>`).join("");
        categoriaLista.addEventListener('change', (event) => {
            const categoriaSelecionada = event.target.value;
            carregarProdutosPorCategoria(categoriaSelecionada, produtoId);
        });
    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
    }
}

async function carregarProdutosPorCategoria(categoriaId, produtoId) {
    if (!categoriaId) {
        document.getElementById(produtoId).innerHTML = '<option value="">Selecione um produto</option>';
        return;
    }

    try {
        const resposta = await fetch("http://localhost:8080/produtos");
        if (!resposta.ok) throw new Error("Erro ao carregar produtos");

        const produtos = await resposta.json();
        const produtosFiltrados = produtos.filter(produto => produto.tipoProduto === Number(categoriaId));

        const produtoLista = document.getElementById(produtoId);
        produtoLista.innerHTML = produtosFiltrados.map(produto => `<option value="${produto.id}">${produto.nome}</option>`).join("");
    } catch (error) {
        console.error(error);
    }
}

function adicionarPedido() {
    const pedidoContainer = document.getElementById('pedidoContainer');
    const novoId = `pedido_${pedidoContainer.children.length + 1}`;

    const novoPedido = document.querySelector('.pedido-item').cloneNode(true);

    novoPedido.querySelector('select[name="pedido"]').value = '';
    novoPedido.querySelector('input[name="quantidade"]').value = '';
    novoPedido.querySelector('input[name="observacao"]').value = '';

    const pedidoWrapper = document.createElement('div');
    pedidoWrapper.classList.add('pedido-wrapper');
    pedidoWrapper.id = novoId;

    const botaoRemover = document.createElement('button');
    botaoRemover.type = 'button';
    botaoRemover.classList.add('botao-remover');
    botaoRemover.onclick = function () {
        removerPedido(this);
    };

    novoPedido.querySelector('select[id^="categoria_lista"]').id = `categoria_lista_${novoId}`;
    novoPedido.querySelector('select[id^="produto_lista"]').id = `produto_lista_${novoId}`;


    pedidoWrapper.appendChild(novoPedido);
    pedidoWrapper.appendChild(botaoRemover);

    pedidoContainer.appendChild(pedidoWrapper);

    carregarCategorias(`categoria_lista_${novoId}`, `produto_lista_${novoId}`);
}

function removerPedido(elemento) {
    const pedidoContainer = document.getElementById('pedidoContainer');
    if (pedidoContainer.children.length > 1) {
        const pedido = elemento.parentNode;
        pedidoContainer.removeChild(pedido);
    } else {
    }
}

async function confirmarEdicao() {
    const url = `http://localhost:8080/pedidos/${popIdPedido}/adicionar-produtos`;

    const produtos = [];
    const pedidoItems = document.querySelectorAll(".pedido-item");

    pedidoItems.forEach(item => {
        const produtoId = item.querySelector("select[id^='produto_lista']").value;
        const quantidade = item.querySelector("input[name='quantidade']").value;
        const observacao = item.querySelector("input[name='observacao']").value;

        if (produtoId && quantidade > 0) {
            produtos.push({
                id: Number(produtoId),
                quantidade: Number(quantidade),
                observacao: observacao
            });
        }
    });

    const corpoRequisicao = {
        listaProdutos: produtos
    };

    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(corpoRequisicao),
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        exibirPopup("Produtos adicionados ao pedido com sucesso!", "success");

        console.log("Adição feita com sucesso");
    } catch (error) {
        console.error("Erro ao confirmar edição:", error);
        exibirPopup("Erro ao adicionar produtos ao pedido. Por favor, tente novamente.", "error");
    }
    location.reload();
}


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

function closePopup() {
    const popupEditar = document.getElementById("popupEditar");
    popupEditar.style.display = "none";
}

