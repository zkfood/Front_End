// document.querySelector('button').addEventListener('click', cadastrarEndereco);

async function cadastrarEndereco() {
    const bairro = document.getElementById('bairro');
    const logradouro = document.getElementById('logradouro');
    const numero = document.getElementById('numero');
    const complemento = document.getElementById('complemento');
    const cep = document.getElementById('cep');
    
    const bairroValue = bairro.value
    const logradouroValue = logradouro.value
    const numeroValue = numero.value
    const complementoValue = complemento.value
    const cepValue = cep.value.replace(/\D/g, '');

    if (!bairroValue || !logradouroValue || !numeroValue || !cepValue) {
        alert("todos os campos obrigatórios devem ser preenchidos!");
        return;
    }

    const enderecoData = {
        cep: cepValue,
        rua: logradouroValue,
        bairro: bairroValue,
        numero: numeroValue,
        complemento: complementoValue
    };

    try {
        const fetchBuilder = new FetchBuilder();
        const idUsuario = 1; // pegar do localhost? lógica ainda nn existe
        
        await fetchBuilder.request(`${ambiente.local}usuarios/${idUsuario}/enderecos`, new Request({
            body: enderecoData,
            method: 'POST'
        }));

        alert('Endereço cadastrado com sucesso!');
    } catch (error) {
        console.error("Erro ao cadastrar endereço:", error);
        alert("Erro ao cadastrar o endereço.");
    }
}