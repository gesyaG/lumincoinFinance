export class Index {
    constructor() {
        this.char();
    }


    char() {
        var pieChartCanvas = document.getElementById('pieChart').getContext('2d');
        var pieChartCanvasTwo = document.getElementById('pieChart-2').getContext('2d');

        var pieData = {
            labels: [
                'Red',
                'Orange',
                'Yellow',
                'Green',
                'Blue',
            ],
            datasets: [{
                data: [700, 500, 400, 600, 300],
                backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD']
            }]
        };

        var pieOptions = {
            maintainAspectRatio: false,
            responsive: true,
        };

        new Chart(pieChartCanvas, {
            type: 'pie',
            data: pieData,
            options: pieOptions
        });
        new Chart(pieChartCanvasTwo, {
            type: 'pie',
            data: pieData,
            options: pieOptions
        });
    }
}