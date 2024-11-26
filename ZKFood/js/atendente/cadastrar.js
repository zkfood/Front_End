document.addEventListener("DOMContentLoaded", () => {
    carregarCategorias('categoria_lista', 'produto_lista');

    // Adiciona evento de mudança no select do tipo de entrega
    const tipoEntregaSelect = document.getElementById("tipoEntrega");
    tipoEntregaSelect.addEventListener("change", verificarTipoEntrega);
});

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
    botaoRemover.textContent = '';
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

        // Filtra os produtos pela categoria e disponibilidade
        const produtosFiltrados = produtos.filter(produto =>
            produto.tipoProduto === Number(categoriaId) && produto.disponibilidade === true
        );

        const produtoLista = document.getElementById(produtoId);
        produtoLista.innerHTML = produtosFiltrados.map(produto =>
            `<option value="${produto.id}">${produto.nome}</option>`
        ).join("");
    } catch (error) {
        console.error(error);
    }
}


async function cadastrarPedido() {
    const tipoEntrega = document.getElementById("tipoEntrega").value;
    const numeroMesa = document.getElementById("mesa").value;

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

    // Corpo do pedido
    const dadosPedido = {
        tipoEntrega: tipoEntrega,
        produtos: produtos,
    };

    // Inclui número da mesa se o tipo de entrega não for "Retirada no balcão"
    if (tipoEntrega !== "Balcão") {
        dadosPedido.numeroMesa = numeroMesa;
    }

    try {
        const respostaCadastro = await fetch("http://localhost:8080/pedidos", {
            method: "POST",
            body: JSON.stringify(dadosPedido),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (respostaCadastro.ok) {
            exibirPopup("Pedido cadastrado com sucesso!", "success");
        } else {
            const erro = await respostaCadastro.json();
            console.error(erro);
            exibirPopup("Erro ao cadastrar o pedido.");
        }
    } catch (error) {
        console.error(error);
        exibirPopup("Ocorreu um erro ao cadastrar o pedido. Tente novamente.", "error");
    }
}

function verificarTipoEntrega() {
    const tipoEntrega = document.getElementById("tipoEntrega").value;
    const mesaLabel = document.getElementById("mesaLabel");
    const mesaInput = document.getElementById("mesa");
    const tipoEntregaContainer = document.getElementById("tipoEntregaContainer");

    if (tipoEntrega === "Balcão") {
        mesaLabel.style.display = "none";
        mesaInput.style.display = "none";
        mesaInput.value = ""; // Limpa o valor da mesa se estiver escondido
        tipoEntregaContainer.id = "tipoEntregaAlternativo"; // Muda o id da div
    } else {
        mesaLabel.style.display = "block";
        mesaInput.style.display = "block";
        tipoEntregaContainer.id = "tipoEntregaContainer"; // Volta o id original da div
    }
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
