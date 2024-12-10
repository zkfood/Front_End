document.addEventListener("DOMContentLoaded", () => {
    listarCardAvaliacao();
});

async function listarCardAvaliacao() {
    const pedidoId = sessionStorage.getItem("PEDIDO_DETALHES");

    if (!pedidoId) {
        console.error("ID do pedido não encontrado no sessionStorage.");
        return;
    }

    const url = `http://localhost:8080/pedidos/${pedidoId}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao buscar o pedido: ${response.statusText}`);
        }

        const pedido = await response.json();

        const container = document.querySelector(".container-avaliacoes");

        container.innerHTML = "";

        for (const produto of pedido.produtos) {
            const card = document.createElement("div");
            card.classList.add("card-avaliacao");
            card.setAttribute("data-produto-id", produto.id);

            // Placeholder enquanto a imagem é carregada
            const imagemPlaceholder = "../../assets/loading-placeholder.png";
            card.innerHTML = `
                <div class="card-imagem">
                    <img src="${imagemPlaceholder}" alt="imagem do item do pedido" class="produto-imagem">
                </div>
                <div class="card-texto">
                    <h1>${produto.nome}</h1>
                    <div class="estrelas">
                        <span class="estrela" data-avaliacao="1">&#9733;</span>
                        <span class="estrela" data-avaliacao="2">&#9733;</span>
                        <span class="estrela" data-avaliacao="3">&#9733;</span>
                        <span class="estrela" data-avaliacao="4">&#9733;</span>
                        <span class="estrela" data-avaliacao="5">&#9733;</span>
                    </div>
                    <textarea placeholder="Digite seu comentário"></textarea>
                    <button class="botao-enviar">Enviar</button>
                </div>
            `;

            container.appendChild(card);

            // Obter a imagem do produto
            const imagemEndpoint = `http://localhost:8080/produtos/imagem/${produto.id}`;
            try {
                const imagemResponse = await fetch(imagemEndpoint);
                if (imagemResponse.ok) {
                    const blob = await imagemResponse.blob();
                    const imageUrl = URL.createObjectURL(blob);

                    // Atualiza o src da imagem no card
                    const imgElement = card.querySelector(".produto-imagem");
                    imgElement.src = imageUrl;
                } else {
                    console.error(`Erro ao buscar a imagem do produto ID ${produto.id}`);
                }
            } catch (imagemError) {
                console.error(`Erro ao carregar a imagem do produto ID ${produto.id}:`, imagemError);
            }

            const estrelas = card.querySelectorAll(".estrela");
            estrelas.forEach((estrela, index) => {
                estrela.addEventListener("click", () => {
                    estrelas.forEach((e, i) => {
                        if (i <= index) {
                            e.classList.add("selecionada");
                        } else {
                            e.classList.remove("selecionada");
                        }
                    });
                });
            });

            const botaoEnviar = card.querySelector(".botao-enviar");
            botaoEnviar.addEventListener("click", () => {
                cadastrarAvaliacao(card);
            });
        }

        console.log("Cards de avaliação gerados com sucesso.");
    } catch (error) {
        console.error("Erro ao listar os cards de avaliação:", error);
    }
}


function cadastrarAvaliacao(card) {
    const idUsuario = sessionStorage.getItem("idUsuario");

    if (!idUsuario) {
        console.error("ID do usuário não encontrado no sessionStorage.");
        exibirPopup("Erro ao cadastrar avaliação. ID do usuário não encontrado.", "error");
        return;
    }

    const idProduto = card.getAttribute("data-produto-id");

    const qtdEstrelas = Array.from(card.querySelectorAll(".estrela.selecionada"))
        .reduce((max, estrela) => Math.max(max, parseInt(estrela.getAttribute("data-avaliacao"))), 0);

    const descricao = card.querySelector("textarea").value.trim();

    if (!qtdEstrelas) {
        exibirPopup("Por favor, selecione a quantidade de estrelas para avaliar.", "error");
        return;
    }

    if (!descricao) {
        exibirPopup("Por favor, insira uma descrição para sua avaliação.", "error");
        return;
    }

    const avaliacao = {
        usuario: parseInt(idUsuario),
        produto: parseInt(idProduto),
        qtdEstrelas: qtdEstrelas,
        descricao: descricao
    };

    fetch("http://localhost:8080/avaliacoes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(avaliacao)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao cadastrar a avaliação: ${response.statusText}`);
            }
            exibirPopup("Avaliação cadastrada com sucesso!", "success");
        })
        .catch(error => {
            console.error("Erro ao cadastrar a avaliação:", error);
            exibirPopup("Erro ao cadastrar a avaliação. Por favor, tente novamente.", "error");
        });
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
    const popup = document.getElementById("popup");
    popup.style.display = "none";
}




function testeImagem() {
    fetch('http://localhost:8080/produtos/imagem/22')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar a imagem: ' + response.status);
        }
        return response.blob(); // Tratando como Blob
    })
    .then(blob => {
        console.log(blob); // Exibindo o Blob no console

        // Se quiser exibir a imagem, pode criar uma URL temporária
        const imageUrl = URL.createObjectURL(blob);
        console.log('URL da imagem:', imageUrl);
        
        // Você pode usar essa URL para exibir a imagem em uma tag <img>
        document.body.innerHTML = `<img src="${imageUrl}" alt="Imagem do produto">`;
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}