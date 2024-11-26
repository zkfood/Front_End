async function buscarKpis() {
    const data = new Date();
    const formattedDate = data.toISOString().slice(0, 19);

    const url = `http://localhost:8080/relatorios/financeiro/kpis?data=${formattedDate}`

    try {
        const resposta = await fetch(url);
        const respostaDados = await resposta.json();
        console.log(respostaDados)

        const div_kpis_presencial = document.getElementById('div_compra_presencial')
        const div_kpis_balcao = document.getElementById('div_compra_balcao')
        const div_kpis_entrega = document.getElementById('div_compra_entrega')

        respostaDados.map(
            item => {
                if (item.tipo_entrega == 'Presencial') {
                    div_kpis_presencial.innerHTML = `${item.receita}`
                }
                if (item.tipo_entrega == 'Entrega') {
                    div_kpis_entrega.innerHTML = `${item.receita}`
                }
                if (item.tipo_entrega == 'Balcão') {
                    div_kpis_balcao.innerHTML = `${item.receita}`
                    console.log(respostaDados.receita)
                }

            }
        )

    } catch (error) {
        console.error("Error", error);
    }
}

async function buscarReceitaAnoMeses() {

    const data = new Date();
    const ano = data.getFullYear();

    const url = `http://localhost:8080/relatorios/financeiro/receita-ano-meses?ano=${ano}`
    try {
        const resposta = await fetch(url);
        const respostaDados = await resposta.json();
        console.log(respostaDados)

        const ctx = document.getElementById('receitaMensalTipoPedidoChart').getContext('2d');
        const chatReceita = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [
                    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                ],
                datasets: [
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        stacked: false,
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Receita Mensal por TIpo de Pedido'
                        }
                    }
                }
            }
        });
        const colors = {
            Entrega: '#ff823f',
            Balcão: '#ffb90a',
            Presencial: '#ffeb32'
        }
        respostaDados.map(
            item => {

                chatReceita.data.datasets.push({
                    label: item.tipoEntrega,
                    data: item.valores,
                    backgroundColor: colors[item.tipoEntrega],
                },)
            }
        )

    } catch (error) {
        console.error("Error", error);
    }
}
async function buscarReceitaAnual() {
    const url = `http://localhost:8080/relatorios/financeiro/receita-por-anos`
    try {
        const resposta = await fetch(url);
        const respostaDados = await resposta.json();
        console.log(respostaDados)

        const ctx = document.getElementById('receitaAnual').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: respostaDados.anos,
                datasets: [
                    {
                        label: 'Presencial',
                        data: respostaDados.receitaPresencial,
                        borderColor: '#ff823f',
                        backgroundColor: '#ff823f',
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Balcão',
                        data: respostaDados.receitaBalcao,
                        borderColor: '#ffb90a',
                        backgroundColor: '#ffb90a',
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Online',
                        data: respostaDados.receitaOnline,
                        borderColor: '#ffeb32',
                        backgroundColor: '#ffeb32',
                        fill: false,
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Receita Anual por Tipo de Entrega'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Ano'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Receita (em R$)'
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Error", error);
    }
}
async function buscarTableProdutoMaisVendido() {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = data.getMonth() + 1;


    const url = `http://localhost:8080/relatorios/financeiro/top-receitas?mes=${mes}&ano=${ano}`

    const div_table = document.getElementById('top-receitas')

    try {
        const resposta = await fetch(url);
        const respostaDados = await resposta.json();
        console.log(respostaDados)

        respostaDados.map(
            item => {
                div_table.innerHTML += `
                    <tr>
                        <td>${item.produto}</td>
                        <td>${item.quantidadeVendida}</td>
                        <td>R$ ${item.receita.toFixed(2)}</td>
                    </tr>`
            }
        )

    } catch (error) {

    }
}


window.onload = buscarKpis();
window.onload = buscarReceitaAnoMeses();
window.onload = buscarReceitaAnual();
window.onload = buscarTableProdutoMaisVendido();

function saidasDoDiaCsv(){
    const url = 'http://localhost:8080/relatorios/csv/saidas-do-dia?data=2024-11-26'

    importCsv(url, 'saidas-do-dia-26-11-2024');
}

// function saidasDoDiaTxt(){
//     const url = 'http://localhost:8080/relatorios/csv/saidas-do-dia?data=2024-11-24'
//
//     importCsv(url);
// }

function receitasCsv(){
    const url = 'http://localhost:8080/relatorios/csv/top-pratos?mes=11&ano=2024'

    importCsv(url, 'receitas-11-2024');
}

function motoboy(){
    const url = 'http://localhost:8080/relatorios/csv/motoboy-mes-ano?mes=11&ano=2024'

    importCsv(url, 'motoboy-11-2024');
}

function importCsv(url, nomeArquivo) {
    fetch(url, {
            method: 'POST'
        }
    )
        .then(response => {
            if (response.ok) {
                return response.blob();
            }
            throw new Error('Erro ao baixar o arquivo');
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = nomeArquivo + '.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Erro:', error));
}