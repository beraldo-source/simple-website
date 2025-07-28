let slideIndex = 0; // Índice do slide atual
let slides = document.getElementsByClassName("slide"); // Obtém todos os elementos com a classe "slide"
let totalSlides = slides.length; // Total de slides

// Função para mostrar o slide atual
function showSlide(index) {
    // Reseta o índice se estiver fora dos limites
    if (index >= totalSlides) {
        slideIndex = 0;
    } else if (index < 0) {
        slideIndex = totalSlides - 1;
    } else {
        slideIndex = index;
    }

    // Esconde todos os slides e remove a classe 'active'
    for (let i = 0; i < totalSlides; i++) {
        slides[i].style.display = "none";  
        slides[i].classList.remove('active'); // Remove a classe active
    }

    // Mostra o slide atual e adiciona a classe 'active'
    slides[slideIndex].style.display = "block";  
    slides[slideIndex].classList.add('active'); // Adiciona a classe active
}

// Função para mudar o slide
function changeSlide(n) {
    showSlide(slideIndex + n); // Chama a função showSlide com o novo índice
}

// Exibe o primeiro slide inicialmente
showSlide(slideIndex);

// Muda o slide automaticamente a cada 3 segundos
setInterval(() => {
    changeSlide(1); // Muda para o próximo slide
}, 3000); // 3000 milissegundos = 3 segundos



// Conta as visitas
document.addEventListener("DOMContentLoaded", function() {
    // Você pode adicionar qualquer lógica adicional aqui, se necessário
});