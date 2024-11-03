const idUsuario = sessionStorage.getItem('IdUsuario');
const idEndereco = 2

function carregarStatusPedido(estado){
    if (estado === "Pedido cancelado") {
        return
    }

    if (estado === "Pedido em espera"){
        const divBotaoCancelar = document.getElementById("divBotaoCancelar")
        divBotaoCancelar.style.display = "flex";

        return;
    }

    if (estado === "Pedido aceito"){
        const img = document.getElementById("icon1");

        img.src = "/ZKFood/assets/Check Mark.png"
    } else if (estado === "Pedido em preparo"){
        const img1 = document.getElementById("icon1");
        img1.src = "/ZKFood/assets/Check Mark.png"

        const img2 = document.getElementById("icon2");
        img2.src = "/ZKFood/assets/Check Mark.png"
    } else if (estado === "Pedido a caminho"){
        const img1 = document.getElementById("icon1");
        img1.src = "/ZKFood/assets/Check Mark.png"

        const img2 = document.getElementById("icon2");
        img2.src = "/ZKFood/assets/Check Mark.png"

        const img3 = document.getElementById("icon3");
        img3.src = "/ZKFood/assets/Check Mark.png"
    }
}

async function carregarPedido(){
    const pedidos = await new FetchBuilder().request(`${ambiente.local + prefix.pedidos}/8`);
    const div = document.getElementById('disposicaoItens');
    const holerite = document.getElementById('holerite');

    let valorTotal = 0;

    pedidos.produtos.map(
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
                            <div class="qtd-itens">${item.quantidade > 1 && `${item.quantidade}x`}</div>
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

    carregarStatusPedido(pedidos.estado);
}

carregarPedido();

async function carregarEndereco(){
    const endereco = await new FetchBuilder().request(`${ambiente.local + prefix.usuarios}/${idUsuario}/${prefix.enderecos}/${idEndereco}`);

    const div = document.getElementById('informacaoEndereco');

    div.innerHTML += `
        <span class="info-nome">Nome: ${endereco.usuario.nome}</span>
<!--        <span class="info-numero">adicionar telefone dps</span>-->
        <span class="info-rua">Rua: ${endereco.rua} ${endereco.numero}</span>
        <span class="info-cep">Bairro | Cep | Complemento: ${endereco.bairro} ${endereco.cep} ${endereco.complemento}</span>
    `;
}

carregarEndereco();

async function cancelarPedido(){

}