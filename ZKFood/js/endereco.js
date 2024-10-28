const idUsuario = sessionStorage.getItem('IdUsuario');

async function cadastrarEndereco() {

    if (idUsuario) {
        const bairro = document.getElementById('bairro');
        const logradouro = document.getElementById('logradouro');
        const numero = document.getElementById('numero');
        const complemento = document.getElementById('complemento');
        const cep = document.getElementById('cep');

        const bairroValue = bairro.value;
        const logradouroValue = logradouro.value;
        const numeroValue = numero.value;
        const complementoValue = complemento.value;
        const cepValue = cep.value.replace(/\D/g, '');

        // Validação simples dos campos obrigatórios
        if (!bairroValue || !logradouroValue || !numeroValue || !cepValue) {
            alert("Todos os campos obrigatórios devem ser preenchidos!");
            return;
        }

        try {
            const url = `http://localhost:8080/usuarios/${idUsuario}/enderecos`;

            // Definindo os cabeçalhos corretamente
            const headers = {
                "Content-Type": "application/json"
            };

            // Fazendo a requisição POST
            const resposta = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    cep: cepValue,
                    rua: logradouroValue,
                    bairro: bairroValue,
                    numero: numeroValue,
                    complemento: complementoValue
                })
            });

            // Verificando o status da resposta
            if (resposta.status === 201 || resposta.status === 200) {
                alert('Endereço cadastrado com sucesso!');
            } else {
                const errorData = await resposta.json();
                console.log('Erro ao cadastrar:', errorData);
                alert('Erro ao cadastrar o endereço!');
            }
        } catch (error) {
            console.error("Erro ao cadastrar endereço:", error);
            alert("Erro ao cadastrar o endereço.");
        }

    } else {
        console.log('ID do usuário não encontrado no sessionStorage.');
    }
}
