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