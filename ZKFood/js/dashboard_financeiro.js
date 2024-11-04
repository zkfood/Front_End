

const ctx1 = document.getElementById('produtosMaisVendidosChart').getContext('2d');
const produtosMaisVendidosChart = new Chart(ctx1, {
    type: 'bar',
    data: {
        labels: ['Produto 1', 'Produto 2', 'Produto 3', 'Produto 4', 'Produto 5'],
        datasets: [{
            label: 'Quantidade Vendida',
            data: [120, 190, 80, 100, 150],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Dados do gráfico de comportamento sazonal
const ctx2 = document.getElementById('comportamentoSazonalChart').getContext('2d');
const comportamentoSazonalChart = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Produto Crítico',
            data: [200, 300, 400, 500, 450, 300, 400, 600, 700, 800, 900, 1000],
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false
        }, {
            label: 'Produto Retirado do Estoque',
            data: [150, 250, 350, 450, 550, 650, 750, 850, 950, 1050, 1150, 1250],
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: false
        }, {
            label: 'Produto Previsto',
            data: [300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400],
            borderColor: 'rgba(255, 206, 86, 1)',
            fill: false
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});