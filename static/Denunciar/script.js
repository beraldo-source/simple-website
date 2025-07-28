// Inicializa o mapa
const map = L.map('map').setView([-22.8350, -47.0475], 17); // Posição inicial do mapa (Brasil)  --> Campinas é ([-22.9056, -47.0608], 13) 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { //-22.83460371971801, -47.047576904296875
    maxZoom: 19,
}).addTo(map);



// Variáveis para armazenar coordenadas
let coordenadas = null;


// Variável para armazenar o marcador atual
let marcadorAtual = null;

// Função para capturar coordenadas ao clicar no mapa
map.on('click', function(e) {
    coordenadas = e.latlng;
    document.getElementById('localizacao').value = `${coordenadas.lat}, ${coordenadas.lng}`;
    
    // Se já existe um marcador, remova-o
    if (marcadorAtual) {
        map.removeLayer(marcadorAtual);
    }

    // Adiciona um novo marcador no mapa
    marcadorAtual = L.marker([coordenadas.lat, coordenadas.lng]).addTo(map)
        .bindPopup('Localização selecionada!')
        .openPopup();

    // Adiciona um evento para remover o marcador quando o popup for fechado
    marcadorAtual.on('popupclose', function() {
        map.removeLayer(marcadorAtual);
        marcadorAtual = null; // Limpa a referência do marcador atual
        
        document.getElementById('localizacao').value = ''; // Limpa o campo de localização
    });
    
});



// Exibir ou ocultar campos de identificação
document.getElementById('anonymo').addEventListener('change', function() {
    const identFields = document.getElementById('identificacao');
    if (this.value === 'nao') {
        identFields.style.display = 'block';
    } else {
        identFields.style.display = 'none';
    }
});

// Enviar o formulário
document.getElementById('denunciaForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const tipoViolacao = document.getElementById('tipoViolacao').value.trim();
    const detalhes = document.getElementById('detalhes').value.trim();
    const localizacao = document.getElementById('localizacao').value.trim();
    const anonymo = document.getElementById('anonymo').value;
    const nome = document.getElementById('nome').value.trim();
    const rg = document.getElementById('rg').value.trim();

    if (tipoViolacao === '' || detalhes === '' || localizacao === '') {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const fotos = document.getElementById('fotos').files;

    const formData = new FormData();
    formData.append('tipoViolacao', tipoViolacao);
    formData.append('detalhes', detalhes);
    formData.append('localizacao', localizacao);
    formData.append('anonymo', anonymo);

    if (anonymo === 'nao') {
        if (nome === '' || rg === '') {
            alert('Por favor, preencha todos os campos de identificação.');
            return;
        }
        formData.append('nome', nome);
        formData.append('rg', rg);
    }

    for (let i = 0; i < fotos.length; i++) {
        formData.append('fotos[]', fotos[i]);
    }

    fetch('http://127.0.0.1:5000/api/denuncia', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            alert('Denúncia enviada com sucesso!');
            document.getElementById('denunciaForm').reset();
            document.getElementById('identificacao').style.display = 'none';
            coordenadas = null;
            map.eachLayer(function (layer) {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });
        } else {
            return response.text().then(text => { throw new Error(text); });
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao enviar a denúncia. Tente novamente.');
    });
});

