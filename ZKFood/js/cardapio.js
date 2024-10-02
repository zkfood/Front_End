async function receberPratos(tipo) {
    const divItensCardapio = document.getElementById('itensCardapio')
    divItensCardapio.innerHTML = ''

    const url = `${ambiente.local+prefix.produtos}`

    const chamada = tipo ? new Request({
        newQueryStringParams: {
            tipo: tipo,
        }
    }) : undefined

    const fetch = await new FetchBuilder().request(url, chamada);

    var linhaItemCardapio = document.createElement('div');
    linhaItemCardapio.className = 'linha-item-cardapio';
    divItensCardapio.appendChild(linhaItemCardapio);

    var contador = 0
    fetch.map(produto => {
        if (contador % 2 === 0 && contador !== 0) {
            linhaItemCardapio = document.createElement('div');
            linhaItemCardapio.className = 'linha-item-cardapio';
            divItensCardapio.appendChild(linhaItemCardapio);
        }
            linhaItemCardapio.innerHTML += `
            <div class="card-cardapio">
                <div class="conteudo-cardapio">
                    <h2>${produto.nome}</h2>
                    <p>${produto.descricao}</p>
                    <div class="servir">
                        <img src="../../assets/icons-usuário-cinza.png" alt="icone de usuario">
                        <h5>Serve ${produto.qtdPessoas} pessoas</h5>
                    </div>
                    <h1><span>R$</span>${produto.valor}</h1>
                </div>
                <div class="imagem-cardapio">
                    <img id="imagem-${produto.descricao}" src="${ambiente.local+prefix.produtos}/imagem/${produto.id}" alt="Foto do prato">
                    <div class="menu-card">
                        <button class="botao-acessar">Ver mais</button>
                        <button class="botao-favoritos"><img src="../../assets/icon-coração-branco.png" alt=""></button>
                    </div>
                </div>
            </div>
        `;
        contador++
    })
}