function cadastro() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;

    const data = {
        nome: nome,
        email: email,
        telefone: telefone
    };

    console.log('Payload Enviado:', data); // Adicione esta linha para verificar o payload

    fetch('http://127.0.0.1:5001/api/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP error! Status: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
