var map = L.map('map').setView([-23.57428, -46.41233], 20);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                L.marker([-23.57428, -46.41233]).addTo(map)
                    .bindPopup('ZKfood')
                    .openPopup();
document.addEventListener('DOMContentLoaded', function () {
        const cards = document.querySelectorAll('.card-avaliacao');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        let currentIndex = 0;
        function updateCarousel() {
            cards.forEach((card, index) => {
                if (index >= currentIndex && index < currentIndex + 3) {
                    card.classList.add('active');
    
                                } else {
                    card.classList.remove('active');
    
                                }        });    }
    prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex -= 1;
                updateCarousel();
    
                            }    });
    nextBtn.addEventListener('click', () => {
            if (currentIndex < cards.length - 3) {
                currentIndex += 1;
                updateCarousel();
    
                            }    });
    updateCarousel();});
