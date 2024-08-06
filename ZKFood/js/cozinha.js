const pedidosEntrega = document.getElementById('pedidosEntrega');
const pedidosMesa = document.getElementById('pedidosMesa');
const pedidosBalcao = document.getElementById('pedidosBalcao');

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

function addordem(tipo, id, quantidade, items, obs) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const title = document.createElement('h2');
    title.textContent = `Pedido #${id}`;
    card.appendChild(title);
    
    const itemsList = document.createElement('ul');
    items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${quantidade}x ${item}`;
        itemsList.appendChild(listItem);
    });
    card.appendChild(itemsList);
    
    const obsText = document.createElement('p');
    obsText.textContent = `OBS: ${obs}`;
    card.appendChild(obsText);
    
    if (tipo === 'entrega') {
        pedidosEntrega.appendChild(card);
    } else if (tipo === 'mesa') {
        pedidosMesa.appendChild(card);
    } else if (tipo === 'balcao') {
        pedidosBalcao.appendChild(card);
    }
}

const pedidos = [
    {
        "id": 1,
        "estado": "Pedido em preparo",
        "estadoPedidoHistorico": [
            {
                "id": 1,
                "estado": "Pedido em espera",
                "hora": "2024-06-10T23:35:16"
            }
        ],
        "produtos": [
            {
                "id": 1,
                "quantidade": 2,
                "observacao": "Descrição Legal",
                "nome": "Produto Exemplo",
                "imagem": null,
                "valor": 20.0,
                "qtdPessoas": "2",
                "descricao": "Descrição do produto exemplo"
            }
        ],
        "numeroMesa": "5",
        "delivery": 12.5,
        "formaPagamento": "Cartão de Crédito",
        "motivoCancelamento": null,
        "tipoEntrega": "Presencial",
        "usuario": {
            "id": 1,
            "nome": "Ale"
        },
        "colaborador": null,
        "telefone": {
            "id": 1,
            "numero": "123456789"
        },
        "endereco": {
            "id": 1,
            "cep": "08160475",
            "rua": "Rua Fred Astaire",
            "bairro": "Jardim Silva Teles",
            "numero": "123",
            "complemento": "complemento"
        }
    },
    {
        "id": 2,
        "estado": "Pedido em preparo",
        "estadoPedidoHistorico": [
            {
                "id": 2,
                "estado": "Pedido em espera",
                "hora": "2024-06-10T23:35:16"
            }
        ],
        "produtos": [
            {
                "id": 4,
                "quantidade": 2,
                "observacao": "oloko",
                "nome": "Produto Exemplo",
                "imagem": null,
                "valor": 20.0,
                "qtdPessoas": "2",
                "descricao": "Descrição do produto exemplo"
            }
        ],
        "numeroMesa": "5",
        "delivery": 12.5,
        "formaPagamento": "Cartão de Crédito",
        "motivoCancelamento": null,
        "tipoEntrega": "Presencial",
        "usuario": {
            "id": 1,
            "nome": "Ale"
        },
        "colaborador": null,
        "telefone": {
            "id": 1,
            "numero": "123456789"
        },
        "endereco": {
            "id": 1,
            "cep": "08160475",
            "rua": "Rua Fred Astaire",
            "bairro": "Jardim Silva Teles",
            "numero": "123",
            "complemento": "complemento"
        }
    }
];

function filtrarPedidosEmPreparo(pedidos) {
    return pedidos.filter(pedido => pedido.estado === "Pedido em preparo");
}

function exibirPedidos(pedidos) {
    pedidos.forEach(pedido => {
        const tipoEntrega = pedido.tipoEntrega.toLowerCase();
        
        pedido.produtos.forEach(produto => {
            const id = pedido.id;
            const quantidade = produto.quantidade;
            const observacao = produto.observacao || "";
            const items = [produto.nome];

            if (tipoEntrega === 'entrega') {
                addordem('entrega', id, quantidade, items, observacao);
            } else if (tipoEntrega === 'presencial') {
                addordem('mesa', id, quantidade, items, observacao);
            } else if (tipoEntrega === 'balcão') {
                addordem('balcao', id, quantidade, items, observacao);
            }
        });
    });
}

// Filtra os pedidos que estão "em preparo"
const pedidosEmPreparo = filtrarPedidosEmPreparo(pedidos);

// Exibe os pedidos filtrados na interface
exibirPedidos(pedidosEmPreparo);

// Função para adicionar uma nova ordem baseada em dados vindos do backend
async function novaOrdemBack(tipo, quantidade, items, obs) {
    const id = Math.floor(Math.random() * 1000) + 1;

    // Lógica para filtrar e exibir pedidos

    addordem(tipo, id, quantidade, items, obs);
}
