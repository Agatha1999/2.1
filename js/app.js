// app.js melhorado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const btnSignin = document.querySelector("#signin");
    const btnSignup = document.querySelector("#signup");
    const body = document.querySelector("body");
    const forms = document.querySelectorAll(".form");
    
    // Transição entre formulários - Versão final
    btnSignin.addEventListener("click", function (e) {
        e.preventDefault();
        
        // Esconde APENAS o texto da coluna esquerda (cadastro)
        document.querySelector('.first-content .first-column').style.opacity = '0';
        
        // Inicia a transição após pequeno delay
        setTimeout(() => {
            body.classList.remove("sign-up-js");
            body.classList.add("sign-in-js"); 
            
            // Restaura a opacidade após a transição
            setTimeout(() => {
                document.querySelector('.second-content .first-column').style.opacity = '1';
            }, 700);
        }, 50);
    });
    
    btnSignup.addEventListener("click", function (e) {
        e.preventDefault();
        
        // Esconde APENAS o texto da coluna esquerda (login)
        document.querySelector('.second-content .first-column').style.opacity = '0';
        
        // Inicia a transição após pequeno delay
        setTimeout(() => {
            body.classList.remove("sign-in-js");
            body.classList.add("sign-up-js");
            
            // Restaura a opacidade após a transição
            setTimeout(() => {
                document.querySelector('.first-content .first-column').style.opacity = '1';
            }, 700);
        }, 50);
    });
    
    // Validação de formulário (mantido do original)
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
        
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    });
    
    function validateField(field) {
        // Implementar validação por tipo de campo
    }
    
    function validateForm(form) {
        // Implementar validação completa
        return true;
    }
});

//firebase
const firebaseConfig = {
    apiKey: "AIzaSyCWPSfbTsxjYJX__SNx8HkTMbR9naeGfVQ",
    authDomain: "dermedia-59e15.firebaseapp.com",
    projectId: "dermedia-59e15",
    storageBucket: "dermedia-59e15.firebasestorage.app",
    messagingSenderId: "258372636265",
    appId: "1:258372636265:web:aadd950764ed504cebdcf8"
  };