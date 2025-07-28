// Inicializa o mapa
const map = L.map('map').setView([-22.9056, -47.0608], 13);

// Adiciona um tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);



// Função para abrir o modal com a imagem
function openModal(imageSrc) {
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const caption = document.getElementById("caption");
    
    modal.style.display = "block";
    modalImage.src = imageSrc;
    caption.innerHTML = ""; // Limpa o texto do caption

    // Ocultar o mapa
    map.getContainer().style.visibility = 'hidden';
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById("imageModal");
    modal.style.display = "none";

    // Mostrar o mapa novamente
    map.getContainer().style.visibility = 'visible';
}

// Função para adicionar marcadores ao mapa
function addMarker(lat, lng, tipoViolacao, detalhes, nome, rg, imagens, id, id_admin, id_visita) {
    const imagensArray = imagens ? imagens.split(',') : []; // Divide a string de imagens em um array

    let imagensHTML = '';
    if (imagensArray.length > 0) {
        imagensHTML = '<strong>Imagens:</strong><br>';
        imagensArray.forEach(imagem => {
            imagensHTML += `<img src="${imagem.trim()}" alt="Imagem da denúncia" class="imagem-denuncia" onclick="openModal('${imagem.trim()}')">`;
        });
    }

    const deleteButton = `<button class="btn-deletar" button onclick="deletarDenuncia(${id})">Deletar Denúncia</button>`;

    L.marker([lat, lng]).addTo(map)
        .bindPopup(`
            <strong>Número da Denuncia:</strong> ${id}<br>
            <strong>Tipo de Violação:</strong> ${tipoViolacao}<br>
            <strong>Detalhes:</strong> ${detalhes}<br>
            <strong>Nome:</strong> ${nome}<br>
            <strong>RG:</strong> ${rg}<br>
            <strong>Número do Admin Responsável:</strong> ${id_admin}<br>
            <strong>ID Visitas:</strong> ${id_visita}<br>
            ${imagensHTML}
            ${deleteButton}
        `);
}

function deletarDenuncia(id) {
    console.log(`Tentando deletar a denúncia com ID: ${id}`); // Verifique se o ID está correto
    fetch(`/api/deletar_denuncia/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Denúncia deletada com sucesso!');
            location.reload(); // Recarrega a página para atualizar o estado
        } else {
            return response.text().then(text => {
                alert(`Erro ao deletar a denúncia: ${text}`);
            });
        }
    })
    .catch(error => console.error('Erro ao deletar a denúncia:', error));
}


// Carregar as denúncias
fetch('/api/denuncias')
    .then(response => response.json())
    .then(data => {
        data.forEach(denuncia => {
            // Aqui você deve extrair a latitude e longitude da localização
            const [lat, lng] = denuncia.localizacao.split(',').map(Number);
            addMarker(lat, lng, denuncia.tipo_violacao, denuncia.detalhes, denuncia.nome, denuncia.rg, denuncia.imagem, denuncia.id_denuncia, denuncia.id_admin, denuncia.id_visita);
        });
    })
    .catch(error => console.error('Erro ao carregar as denúncias:', error));



// Chama a função para carregar as denúncias
loadDenuncias();


/*

function addMarker(lat, lng, tipoViolacao, detalhes, nome, rg, imagens) {
    const imagensArray = imagens ? imagens.split(',') : []; // Divide a string de imagens em um array

    let imagensHTML = '';
    if (imagensArray.length > 0) {
        imagensHTML = '<strong>Imagens:</strong><br>';
        imagensArray.forEach(imagem => {
            imagensHTML += `<img src="${imagem.trim()}" alt="Imagem da denúncia" style="width:100px;height:auto;cursor:pointer;" onclick="openModal('${imagem.trim()}')">`;
        });
    }

    L.marker([lat, lng]).addTo(map)
        .bindPopup(`
            <strong>Tipo de Violação:</strong> ${tipoViolacao}<br>
            <strong>Detalhes:</strong> ${detalhes}<br>
            <strong>Nome:</strong> ${nome}<br>
            <strong>RG:</strong> ${rg}<br>
            ${imagensHTML}
        `);
}

*/