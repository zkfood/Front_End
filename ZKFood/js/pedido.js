async function cadastrarPedido() {
    const usuario = sessionStorage.getItem('idUsuario');
    const endereco = sessionStorage.getItem('ENDERECO_CARRINHO');
    const tipoEntrega = sessionStorage.getItem('TIPO_ENTREGA_CARRINHO');
    const produtos = JSON.parse(sessionStorage.getItem('PRODUTOS_CARRINHO'));

    const pedido = await fetch(`${ambiente.local}${prefix.pedidos}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario,
            produtos,
            endereco,
            tipoEntrega
        })
    })

    sessionStorage.removeItem('ENDERECO_CARRINHO');
    sessionStorage.removeItem('TIPO_ENTREGA_CARRINHO');
    sessionStorage.removeItem('PRODUTOS_CARRINHO');

    window.location = './historico-pedidos.html'
}