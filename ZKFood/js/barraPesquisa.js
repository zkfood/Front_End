let produtos = [];

async function carregarProdutos() {
    try {
        const response = await fetch("http://localhost:8080/produtos");
        if (!response.ok) throw new Error("Erro ao carregar produtos");
        produtos = await response.json();
    } catch (error) {
        console.error(error);
        alert("Não foi possível carregar os produtos. Verifique o endpoint.");
    }
}

// Função para atualizar as sugestões de pesquisa
function atualizarSugestoes(query) {
    const suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = ""; // Limpar sugestões anteriores

    if (query.trim() === "") {
        suggestionsContainer.classList.remove("active");
        return; // Não mostrar nada se o campo estiver vazio
    }

    // Filtrar os produtos com base no nome
    const resultados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(query.toLowerCase())
    );

    // Adicionar os resultados como sugestões
    resultados.forEach(produto => {
        const suggestionDiv = document.createElement("div");
        suggestionDiv.className = "suggestion";
        suggestionDiv.textContent = produto.nome;
        suggestionDiv.addEventListener("click", () => {
            document.getElementById("searchInput").value = produto.nome; // Preencher a barra de pesquisa
            suggestionsContainer.innerHTML = ""; // Limpar sugestões
            suggestionsContainer.classList.remove("active");
        });
        suggestionsContainer.appendChild(suggestionDiv);
    });

    if (resultados.length > 0) {
        suggestionsContainer.classList.add("active");
    } else {
        suggestionsContainer.classList.remove("active");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Adicionando o evento de digitação na barra de pesquisa
    document.getElementById("searchInput").addEventListener("input", event => {
        const query = event.target.value;
        atualizarSugestoes(query);
    });

    // Carregar os produtos ao iniciar
    carregarProdutos();
});


// Função para armazenar o valor da pesquisa e redirecionar
document.getElementById('searchIcon').addEventListener('click', function() {
    var searchInputValue = document.getElementById('searchInput').value;
    
    // Armazenando o valor da pesquisa no localStorage
    localStorage.setItem('searchQuery', searchInputValue);

    // Redirecionando para a página do cardápio
    window.location.href = "../../html/cliente/cardapio.html";
});
