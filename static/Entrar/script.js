/* Coloca o olhozinho de esconder/mostrar a senha */

document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-eye'); // Troca para olho fechado
    icon.classList.toggle('fa-eye-slash'); // Troca para olho aberto
});


document.getElementById('login').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const formData = new FormData(this);

    fetch(this.action, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            // Se a resposta for bem-sucedida, redireciona ou faz o que for necessário
            window.location.href = response.url; // Redireciona para a URL do painel
        } else {
            return response.json().then(data => {
                alert(data.error); // Exibe o erro em um alert
            });
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao tentar fazer login.'); // Exibe um erro genérico
    });
});