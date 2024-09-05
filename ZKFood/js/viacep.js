async function buscarCEP() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');

    if (cep !== "") {
        const validacep = /^[0-9]{8}$/;

        if (validacep.test(cep)) {
            const fetchBuilder = new FetchBuilder();

            const data = await fetchBuilder.request(`https://viacep.com.br/ws/${cep}/json/`);

            if (data.erro) {
                alert("CEP não encontrado.");
                return;
            }
    
            document.getElementById('bairro').value = data.bairro;
            document.getElementById('logradouro').value = data.logradouro;
            document.getElementById('complemento').value = data.complemento || '';
        } else {
            // TODO: colocar span com corzinha vermelha
            alert("Formato de CEP inválido.");
        }
    }
}