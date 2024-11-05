async function buscarCEP() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');

    if (cep !== "") {
        const validacep = /^[0-9]{8}$/;

        if (validacep.test(cep)) {

            try {
                const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await resposta.json(); // Convertendo a resposta para JSON

                if (data.erro) {
                    alert("CEP não encontrado.");
                    return;
                }

                // Preenchendo os campos com os dados retornados da API
                document.getElementById('bairro').value = data.bairro;
                document.getElementById('logradouro').value = data.logradouro;
                document.getElementById('complemento').value = data.complemento || '';
            } catch (error) {
                alert("Erro ao buscar o CEP. Tente novamente.");
            }

        } else {
            // TODO: colocar span com cor vermelha para exibir mensagem de erro no formulário
            alert("Formato de CEP inválido.");
        }
    }
}
