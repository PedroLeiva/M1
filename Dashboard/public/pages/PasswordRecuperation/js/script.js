const brand = document.querySelector('.form_side .container .brand');
const forgot_password_txt = document.querySelector('#forgot_password');
const btSave = document.querySelector('.btSave');
const btSend = document.querySelector('.btSend');
const btCancel = document.querySelector('.btCancel');
const loading = document.querySelector('.loading_screen');
const loading_msg = document.querySelector('#loading_message');

window.onload = setId();

function setId() {
    var url = window.location.href;
    var res = url.split('/?');
    document.getElementById("idFuncionario").setAttribute('value', res[1]);
}

function save() {
    event.preventDefault();
    const form = new URLSearchParams(new FormData(form_update));

    if (validate_passwords()) {
        loading_screen();
        setTimeout(() => {
            update_password(form);
        }, 3000);
    }
}

function validate_passwords() {
    if (password.value === confirm_password.value) {
        return true;
    } else {
        message.innerHTML = "Senhas devem ser idênticas";
        password.style = "display: flex; border-color: var(--red)";
        confirm_password.style = "display: flex; border-color: var(--red)";
        return false;
    }
}

function loading_screen() {
    hide_login_components();
    loading_msg.innerHTML = "<span>A</span>guarde um momento";
    setTimeout(() => {
        loading.style = "display: flex";
    }, 990);
}

function hide_login_components() {
    brand.style = "animation: fade_out 1000ms"
    message.style = "animation: fade_out 1000ms";
    password.style = "animation: move_right_out 1000ms";
    confirm_password.style = "animation: move_right_out 1000ms 200ms";
    btSave.style = "animation: fade_out 800ms 300ms"

    setTimeout(() => {
        brand.style = "display: none";
        message.style = "display: none";
        password.style = "display: none";
        confirm_password.style = "display: none";
        btSave.style = "display: none";
    }, 990);
}

function show_login_components() {
    brand.style = "display: flex";
    message.style = "display: block";
    password.style = "display: none";
    password.style = "display: flex;";
    confirm_password.style = "display: flex;";
    btSave.style = "display: block";
}

function update_password(form) {
    fetch(`/funcionarioSuporte/atualizarSenha`, {
        method: "POST",
        body: form
    }).then(resposta => {
        if (resposta.ok) {
            resposta.text().then(texto => {
                update_success(texto);
            });
        } else {
            console.log(resposta);
            resposta.text().then(error => {
                update_failed(error);
            });
        }
    });
}

function update_failed(error) {
    setTimeout(() => {
        loading_msg.style = "animation: fade_out 1000ms";
        loading_gif.style = "animation: fade_out 2000ms";
    }, 1000);

    setTimeout(() => {
        loading_gif.style = "display: none";
        loading_msg.style = "animation: fade_in 1000ms";
        loading_msg.innerHTML = error;
    }, 1000);

    setTimeout(() => {
        loading_gif.style = "display: block";
        loading.style = "display: none";
        show_login_components();
    }, 3000);
}

function update_success(msg) {
    setTimeout(() => {
        loading_msg.style = "animation: fade_out 1000ms";
        loading_gif.style = "animation: fade_out 2000ms";
    }, 1000);

    setTimeout(() => {
        loading_gif.style = "display: none";
        loading_msg.style = "animation: fade_in 1000ms";
        loading_msg.innerHTML = msg;
    }, 1000);

    setTimeout(() => {
        window.location.href = "http://localhost:3000/";
    }, 2000);
}