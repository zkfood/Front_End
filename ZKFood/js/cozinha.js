const pedidosEntrega = document.getElementById('pedidosEntrega');
const pedidosMesa = document.getElementById('pedidosMesa');
const pedidosBalcao = document.getElementById('pedidosBalcao');
function updateDateTime() {
    const now = new Date();
    const daysOfWeek = ["DOMINGO", "SEGUNDA-FEIRA", "TERÇA-FEITA", "QUARTA-FEIRA", "QUINTA-FEIRA", "SEXTA-FEIRA", "SÁBADO"];
    const day = daysOfWeek[now.getDay()];
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const dateTimeString = `${day}, ${hours}:${minutes}`;
    document.getElementById('date-time').textContent = dateTimeString;
}

setInterval(updateDateTime, 1000);
updateDateTime();

function addordem(tipo, id, items, obs) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const title = document.createElement('h2');
    title.textContent = `${id}`;
    card.appendChild(title);
    
    const itemsList = document.createElement('ul');
    items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        itemsList.appendChild(listItem);
    });
    card.appendChild(itemsList);
    
    const obsText = document.createElement('p');
    obsText.textContent = `OBS: ${obs}`;
    card.appendChild(obsText);
    
    if (tipo === 'entrega') {
        pedidosEntrega.appendChild(card);
    } else if (tipo === 'mesa') {
        pedidosMesa.appendChild(card);
    } else if (tipo === 'balcao') {
        pedidosBalcao.appendChild(card);
    }
}

// finge adição de pedidos
addordem('entrega', 101, ['1x Feijoada Média', '1x Parmegiana', '1x Coca-Cola Lata 350ml'], 'Sem gelo e com limão');
addordem('mesa', 102, ['2x Feijoada Grande', '1x Suco de Laranja'], 'Sem açúcar');
addordem('balcao', 103, ['1x Hambúrguer', '1x Batata Frita', '1x Refrigerante'], 'Sem cebola');

//POC com o back
function novaOrdem(tipo, items, obs) {
    const id = Math.floor(Math.random() * 1000) + 1;  
    addordem(tipo, id, items, obs);
}

// exemplo
novaOrdem('entrega', ['1x Lasanha', '1x Suco de Uva'], 'Sem gelo');
novaOrdem('mesa', ['1x Pizza Margherita', '1x Cerveja'], 'Com gelo');
novaOrdem('balcao', ['1x Cachorro Quente', '1x Guaraná'], 'Com maionese');


async function novaOrdemBack(tipo, items, obs) {
    const id = Math.floor(Math.random() * 1000) + 1;
    
    //aqui ficaria a requisição
    
    addordem(tipo, id, items, obs);
}