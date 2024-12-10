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
                    div_kpis_presencial.innerHTML = `${item.receita}`
                }
                if (item.tipo_entrega == 'Entrega') {
                    div_kpis_entrega.innerHTML = `${item.receita}`
                }
                if (item.tipo_entrega == 'Balcão') {
                    div_kpis_balcao.innerHTML = `${item.receita}`
                }

            }
        )

    } catch (error) {
        console.error("Error", error);
    }
}

const data = new Date();
const ano = data.getFullYear();

let receitaMensalTipoPedidoChart;
let receitaAnualChart;

// Função buscarReceitaAnoMeses ajustada
async function buscarReceitaAnoMeses(ano) {
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
                        data: respostaDados.receitaEntrega,
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

    const filtro = document.getElementById('inputFiltroTopReceitas').value

    const dataTransformada = filtro ? filtro : (dataBase).split("T")[0]

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
    buscarReceitaAnoMeses(ano);
    buscarReceitaAnual();
    buscarTableProdutoMaisVendido();
}

async function motoboyImport() {
    const csvInput = document.getElementById('motoboyFile')
    const file = csvInput?.files?.[0];

    const formData = new FormData();
    formData.append('file', file);

    try {
        await fetch('http://localhost:8080/relatorios/csv/upload-motoboy', {
            method: 'POST',
            body: formData,
        });
    } catch (error) {
        console.error('Erro ao enviar o arquivo:', error);
    }
}

function saidasDoDiaCsv(){
    const data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);
    const dataBase = data2.toISOString().replace(/\.\d{3}Z$/, '');

    const filtro = document.getElementById('inputSaidasDoDiaCsv').value

    const dataTransformada = filtro ? filtro : (dataBase).split("T")[0]

    const url = `http://localhost:8080/relatorios/csv/saidas-do-dia?data=${dataTransformada}`;

    downloadFile(url, `saidas-do-dia-${dataTransformada}`, 'csv');
}

function saidasDoDiaTxt(){
    const data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);
    const dataBase = data2.toISOString().replace(/\.\d{3}Z$/, '');

    const filtro = document.getElementById('inputSaidasDoDiaCsv').value

    const dataTransformada = filtro ? filtro : (dataBase).split("T")[0]

    const url = `http://localhost:8080/relatorios/txt/saidas-do-dia?data=${dataTransformada}`;

    downloadFile(url, `saidas-do-dia-${dataTransformada}`, 'txt');
}

function receitasCsv(){
    const filtro = document.getElementById('inputFiltroTopReceitas').value

    const year = filtro ? filtro.split('-')[0] : data.getFullYear();
    const month = filtro ? filtro.split('-')[1].split('-')[0] : data.getMonth() + 1;

    const url = `http://localhost:8080/relatorios/csv/top-pratos?mes=${month}&ano=${year}`

    downloadFile(url, `receitas-${month}-${year}`, 'csv');
}

function motoboy(){
    const filtro = document.getElementById('inputMotoboyExport').value

    const year = filtro ? filtro.split('-')[0] : data.getFullYear();
    const month = filtro ? filtro.split('-')[1] : data.getMonth() + 1;

    const url = `http://localhost:8080/relatorios/csv/motoboy-mes-ano?mes=${month}&ano=${year}`;

    downloadFile(url, `motoboy-${month}-${year}`, 'csv');
}

function downloadFile(url, nomeArquivo, tipo) {
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
            a.download = nomeArquivo + '.' + tipo;
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
