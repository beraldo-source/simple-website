// Inicializa o mapa
const map = L.map('map').setView([-22.8720, -47.0578], 13); 

// Adiciona um tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Função para buscar as denúncias do servidor
function fetchDenuncias() {
    fetch('http://127.0.0.1:5000/api/denuncias')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(denuncias => {
            console.log('Denúncias:', denuncias); // Log para ver as denúncias
            if (denuncias.length === 0) {
                console.log('Nenhuma denúncia encontrada.');
                return;
            }
            denuncias.forEach(denuncia => {
                console.log('Denúncia atual:', denuncia); // Log para ver cada denúncia
                const coords = denuncia.localizacao.split(',').map(Number);
                
                // Cria o marcador e adiciona ao mapa
                const marker = L.marker(coords).addTo(map);

                // Adiciona um evento de clique ao marcador para abrir o popup
                marker.on('click', function() {
                    // Remove qualquer popup previamente vinculado
                    this.unbindPopup();

                    // Cria o conteúdo do popup
                    let popupContent = `<strong>Tipo de Denúncia:</strong> ${denuncia.tipo_violacao ? denuncia.tipo_violacao : 'Não especificado'}<br>`;
                    
                    if (denuncia.imagem) {
                        const imagePaths = denuncia.imagem.split(',').map(path => path.trim());
                        imagePaths.forEach(imagePath => {
                            const imageUrl = imagePath.startsWith('/') ? imagePath : '/' + imagePath;

                            // Verifica se a URL da imagem é válida antes de adicionar
                            if (imageUrl) {
                                popupContent += `<img src="${imageUrl}" alt="Imagem da denúncia" class="imagem-denuncia">`;
                            }
                        });
                    }

                    // Vincula o conteúdo do popup ao marcador e abre
                    this.bindPopup(popupContent).openPopup();
                });
            });
        })
        .catch(error => {
            console.error('Erro ao buscar denúncias:', error);
        });
}

// Chama a função para buscar e exibir as denúncias
fetchDenuncias();