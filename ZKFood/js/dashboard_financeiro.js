async function buscarKpis() {
    const data = new Date();
    const data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);
    const dataBase = data2.toISOString().replace(/\.\d{3}Z$/, '');

    const url = `http://localhost:8080/relatorios/financeiro/kpis?data=${dataBase}`

    try {
        const resposta = await fetch(url);
        const respostaDados = await resposta.json();

        const div_kpis_presencial = document.getElementById('div_compra_presencial')
        const div_kpis_balcao = document.getElementById('div_compra_balcao')
        const div_kpis_entrega = document.getElementById('div_compra_entrega')

        respostaDados.map(
            item => {
                if (item.tipo_entrega == 'Presencial') {
                    div_kpis_presencial.innerHTML = `${item.receita.toFixed(2)}`
                }
                if (item.tipo_entrega == 'Entrega') {
                    div_kpis_entrega.innerHTML = `${item.receita.toFixed(2)}`
                }
                if (item.tipo_entrega == 'Balcão') {
                    div_kpis_balcao.innerHTML = `${item.receita.toFixed(2)}`
                }

            }
        )

    } catch (error) {
        console.error("Error", error);
    }
}

const data = new Date();
var ano = data.getFullYear();
buscarReceitaAnoMeses(ano)

let receitaMensalTipoPedidoChart;
let receitaAnualChart;

// Função buscarReceitaAnoMeses ajustada
async function buscarReceitaAnoMeses(ano = 2024) {
    const url = `http://localhost:8080/relatorios/financeiro/receita-ano-meses?ano=${ano}`;
    try {
        const resposta = await fetch(url);
        const respostaDados = await resposta.json();

        const ctx = document.getElementById('receitaMensalTipoPedidoChart').getContext('2d');

        // Destroi o gráfico existente se necessário
        if (receitaMensalTipoPedidoChart) {
            receitaMensalTipoPedidoChart.destroy();
        }

        receitaMensalTipoPedidoChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [
                    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                ],
                datasets: respostaDados.map(item => ({
                    label: item.tipoEntrega,
                    data: item.valores,
                    backgroundColor: item.tipoEntrega === 'Entrega' ? '#ff823f' :
                                     item.tipoEntrega === 'Balcão' ? '#ffb90a' : '#ffeb32',
                }))
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
                            text: 'Receita Mensal por Tipo de Pedido'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error", error);
    }
}

async function buscarReceitaAnual() {
    const url = `http://localhost:8080/relatorios/financeiro/receita-por-anos`;
    try {
        const resposta = await fetch(url);
        const respostaDados = await resposta.json();

        const ctx = document.getElementById('receitaAnual').getContext('2d');

        // Destroi o gráfico existente se necessário
        if (receitaAnualChart) {
            receitaAnualChart.destroy();
        }

        receitaAnualChart = new Chart(ctx, {
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
    const data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);
    const dataBase = data2.toISOString().replace(/\.\d{3}Z$/, '');
    const dataTransformada = (dataBase).split("T")[0]

    const url = `http://localhost:8080/relatorios/financeiro/top-receitas?data=${dataTransformada}`;

    const tbody = document.querySelector('#top-receitas tbody');
    try {
        const resposta = await fetch(url);
        const respostaDados = await resposta.json();

        let linhas = '';
        respostaDados.map(item => {
            linhas += `
                <tr>
                    <td>${item.produto}</td>
                    <td>${item.quantidadeVendida}</td>
                    <td>R$ ${item.receita.toFixed(2)}</td>
                </tr>
            `;
        });

        tbody.innerHTML = linhas;

    } catch (error) {
        console.error(error);
    }
}

window.onload = function () {
    buscarKpis();
    buscarReceitaAnoMeses();
    buscarReceitaAnual();
    buscarTableProdutoMaisVendido();
}

function saidasDoDiaCsv(){
    const url = 'http://localhost:8080/relatorios/csv/saidas-do-dia?data=2024-11-26';

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

function filtrar() {
    const inputFiltro = document.getElementById('input_filtro');
    const anoFiltro = parseInt(inputFiltro.value, 10);

    if (!isNaN(anoFiltro) && anoFiltro > 2000) {
        buscarReceitaAnoMeses(anoFiltro);
    } else {
        alert('Insira um ano válido.');
    }
}
