document.querySelector('button').addEventListener('click', cadastrarEndereco);

async function cadastrarEndereco() {
    const bairro = document.getElementById('bairro').value;
    const logradouro = document.getElementById('logradouro').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;
    const cep = document.getElementById('cep').value.replace(/\D/g, '');

    if (!bairro || !logradouro || !numero || !cep) {
        alert("todos os campos obrigatórios devem ser preenchidos!");
        return;
    }

    const enderecoData = {
        cep: cep,
        rua: logradouro,
        bairro: bairro,
        numero: numero,
        complemento: complemento
    };

    try {
        const fetchBuilder = new FetchBuilder();
        const idUsuario = 1; // pegar do localhost? lógica ainda nn existe
        
        const novoEndereco = await fetchBuilder.request(`${ambiente.local}usuarios/${idUsuario}/enderecos`, new Request({
            body: enderecoData,
            method: 'POST'
        }));

        alert('Endereço cadastrado com sucesso!');
    } catch (error) {
        console.error("Erro ao cadastrar endereço:", error);
        alert("Erro ao cadastrar o endereço.");
    }
}