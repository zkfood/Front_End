document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card-avaliacao');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    function updateCarousel() {
        cards.forEach((card, index) => {
            if (index === currentIndex) {
                card.classList.add('active');
                card.style.display = 'flex';
            } else {
                card.classList.remove('active');
                card.style.display = 'none';
            }
        });
    }

    // Botão Anterior
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex -= 1;
            updateCarousel();
        }
    });

    // Botão Próximo
    nextBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) {
            currentIndex += 1;
            updateCarousel();
        }
    });

    updateCarousel();
});
