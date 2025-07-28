/* Coloca o olhozinho de esconder/mostrar a senha */

document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-eye'); 
    icon.classList.toggle('fa-eye-slash');
});


document.getElementById('login').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    fetch(this.action, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            
            window.location.href = response.url; 
        } else {
            return response.json().then(data => {
                alert(data.error); // Exibe o erro em um alert
            });
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao tentar fazer login.'); 
    });
});