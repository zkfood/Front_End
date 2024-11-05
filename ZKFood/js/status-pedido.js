const idUsuario = sessionStorage.getItem('idUsuario');
const pedidoSessionStorage = sessionStorage.getItem('PEDIDO_DETALHES');
let idPedido = 0;

function carregarStatusPedido(estado) {
    if (estado === "Pedido cancelado") {
        return
    }

    if (estado === "Pedido em espera") {
        const divBotaoCancelar = document.getElementById("divBotaoCancelar")
        divBotaoCancelar.style.display = "flex";

        return;
    }

    if (estado === "Pedido aceito") {
        const img = document.getElementById("icon1");

        img.src = "/ZKFood/assets/Check Mark.png"
    } else if (estado === "Pedido em preparo") {
        const img1 = document.getElementById("icon1");
        img1.src = "/ZKFood/assets/Check Mark.png"

        const img2 = document.getElementById("icon2");
        img2.src = "/ZKFood/assets/Check Mark.png"
    } else if (estado === "Pedido a caminho") {
        const img1 = document.getElementById("icon1");
        img1.src = "/ZKFood/assets/Check Mark.png"

        const img2 = document.getElementById("icon2");
        img2.src = "/ZKFood/assets/Check Mark.png"

        const img3 = document.getElementById("icon3");
        img3.src = "/ZKFood/assets/Check Mark.png"
    }
}

async function carregarPedido() {
    const pedido = await new FetchBuilder().request(`${ambiente.local + prefix.pedidos}/${pedidoSessionStorage}`);
    idPedido = pedido.id;
    const div = document.getElementById('disposicaoItens');
    const holerite = document.getElementById('holerite');

    let valorTotal = 0;

    pedido.produtos.map(
        item => {
            valorTotal += item.valor * item.quantidade;

            holerite.innerHTML += `
                <div class="item-pedido">
                    <span>${item.quantidade}x ${item.nome}</span> <span>R$ ${(item.valor * item.quantidade).toFixed(2)}</span>
                </div>
            `;

            div.innerHTML += `
                <div class="card-item">
                    <div class="card-cardapio">
                        <div class="conteudo-cardapio">
                            <div class="qtd-itens">${item.quantidade}x</div>
                            <h2>${item.nome}</h2>
                            <p>${item.descricao}</p>
                            <div class="servir">
                                <img src="../../assets/icons-usuário-cinza.png" alt="icone de usuario">
                                <h5>Serve ${item.qtdPessoas} pessoas</h5>
                            </div>
                            <h1><span>R$</span>${item.valor * item.quantidade}</h1>
                        </div>
                        <div class="imagem-cardapio">
                            <img src="${ambiente.local + prefix.produtos}/imagem/${item.id}" alt="Foto do prato">
                        </div>
                    </div>
                </div>   
            `;
        }
    )

    holerite.innerHTML += `
        <div class="item-pedido">
            <span>Taxa de entrega</span> <span>R$ 8,00</span>
        </div>
    `;

    valorTotal += 8;

    const divValorTotal = document.getElementById('valorTotal');
    divValorTotal.innerHTML = 'R$ ' + valorTotal.toFixed(2);

    carregarStatusPedido(pedido.estado);
    await carregarEndereco(pedido.endereco.id);
}

window.onload = function () {
    try {
        carregarPedido();
    } catch (erro) {
        const div = document.getElementById('bannerStatus')
        div.innerHTML = `
            <div class="container-notificacao">
                <div class="card-notificacao">
                    <img src="../../assets/check erro.png" alt="icone de X">
                    <div class="conteudo-notificacao">
                        <h2>Oops! Tivemos um problema com o seu pedido.</h2>
                        <p>Descrição do problema. Entre em contato pelo WhatsApp <a href="https://wa.me/5511986744335">(11)98674-4335</a></p>
                    </div>
                </div>
            </div>
        `;
    }
}

async function carregarEndereco(id) {
    const endereco = await new FetchBuilder().request(`${ambiente.local + prefix.usuarios}/${idUsuario}/${prefix.enderecos}/${id}`);

    const div = document.getElementById('informacaoEndereco');

    div.innerHTML += `
        <span class="info-nome">Nome: ${endereco.usuario.nome}</span>
<!--        <span class="info-numero">adicionar telefone dps</span>-->
        <span class="info-rua">Rua: ${endereco.rua} ${endereco.numero}</span>
        <span class="info-cep">Bairro | Cep | Complemento: ${endereco.bairro} ${endereco.cep} ${endereco.complemento}</span>
    `;
}

async function cancelarPedido() {
    const fetchBuilder = new FetchBuilder();

    const resposta = await fetch(`${ambiente.local}estado-pedido-historico`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            estado: "Pedido cancelado",
            pedido: idPedido
        })
    })

    await fetchBuilder.request(`${ambiente.local}estado-pedido-historico`, request);

    exibirPopup("Pedido cancelado com sucesso!", "success")
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