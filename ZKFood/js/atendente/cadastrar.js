async function carregarCategorias() {
    const resposta = await fetch("http://localhost:8080/tipo-produtos");
    const categorias = await resposta.json();
    
    const categoriaLista = document.getElementById("categoria_lista");
    categoriaLista.innerHTML = categorias.map(categoria => `<option value="${categoria.id}">${categoria.nome}</option>`).join("");
}

async function carregarProdutosPorCategoria(categoriaId) {
    if (!categoriaId) {
        document.getElementById("produto_lista").innerHTML = '<option value="">Selecione um produto</option>';
        return;
    }

    try {
        const resposta = await fetch("http://localhost:8080/produtos");
        if (!resposta.ok) throw new Error("Erro ao carregar produtos");
        
        const produtos = await resposta.json();
        const produtosFiltrados = produtos.filter(produto => produto.tipoProduto === Number(categoriaId));
        
        const produtoLista = document.getElementById("produto_lista");
        produtoLista.innerHTML = produtosFiltrados.map(produto => `<option value="${produto.id}">${produto.nome}</option>`).join("");
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar produtos. Tente novamente.");
    }
}

async function cadastrarPedido() {
    const numeroMesa = document.getElementById("mesa").value;
    const tipoEntrega = document.getElementById("tipoEntrega").value;

    const produtos = [];
    const pedidoItems = document.querySelectorAll(".pedido-item");

    pedidoItems.forEach(item => {
        const produtoId = item.querySelector("#produto_lista").value; 
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

    const dadosPedido = {
        numeroMesa: numeroMesa,
        delivery: 0.0, //teste
        formaPagamento: "Cartão de Crédito", // teste
        tipoEntrega: tipoEntrega,
        produtos: produtos,
        usuario: 1, //teste
        telefone: 1, //teste
        endereco: 1 //teste
    };

    try {
        const respostaCadastro = await fetch("http://localhost:8080/pedidos", {
            method: "POST",
            body: JSON.stringify(dadosPedido),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (respostaCadastro.ok) {
            alert("Pedido cadastrado com sucesso!");
        } else {
            const erro = await respostaCadastro.json();
            console.error(erro);
            alert("Erro ao cadastrar o pedido: " + erro.message);
        }
    } catch (error) {
        console.error(error);
        alert("Ocorreu um erro ao cadastrar o pedido. Tente novamente.");
    }
}


document.addEventListener("DOMContentLoaded", () => {
    carregarCategorias();

    document.getElementById("categoria_lista").addEventListener("change", (event) => {
        const categoriaId = event.target.value;
        carregarProdutosPorCategoria(categoriaId);
    });

    document.querySelector(".botao-pedido").addEventListener("click", cadastrarPedido);
});
