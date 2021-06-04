const brand = document.querySelector('.form_side .container .brand');
const forgot_password_txt = document.querySelector('#forgot_password');
const btLogin = document.querySelector('.btLogin');
const btSend = document.querySelector('.btSend');
const btCancel = document.querySelector('.btCancel');
const loading = document.querySelector('.loading_screen');
const loading_msg = document.querySelector('#loading_message');

function login() {
    event.preventDefault();
    loading_screen();

    const form = new URLSearchParams(new FormData(form_login));
    const user = form_login.user.value;

    if (user.indexOf('@') > 0) {
        setTimeout(() => {
            user_authentication(form);
        }, 3000);
    } else {
        setTimeout(() => {
            agency_authentication(form);
        }, 3000);
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
    user.style = "animation: move_right_out 1000ms";
    password.style = "animation: move_right_out 1000ms 200ms";
    forgot_password_txt.style = "animation: fade_out 1000ms 300ms";
    btLogin.style = "animation: fade_out 800ms 300ms"

    setTimeout(() => {
        brand.style = "display: none";
        message.style = "display: none";
        user.style = "display: none";
        password.style = "display: none";
        forgot_password_txt.style = "display: none";
        btLogin.style = "display: none";
    }, 990);
}

function show_login_components(erro) {
    brand.style = "display: flex";
    message.style = "display: block";
    email.style = "display: none";
    user.style = "display: flex;";
    password.style = "display: flex;";
    forgot_password_txt.style = "display: flex";
    btLogin.style = "display: block";

    if (erro) {
        user.style = "display: flex; border-color: var(--red)";
        password.style = "display: flex; border-color: var(--red)";
    }
}

function user_authentication(form) {
    fetch("/funcionarioSuporte/autenticar", {
        method: "POST",
        body: form
    }).then(resposta => {
        if (resposta.ok) {
            resposta.json().then(json => {
                sessionStorage.setItem('idFuncionarioSuporte', json.idFuncionarioSuporte);
                sessionStorage.setItem('nomeCompleto', json.nomeCompleto);
                sessionStorage.setItem('email', json.email);
                sessionStorage.setItem('numAgencia', json.fk_numAgencia);
                sessionStorage.setItem('mode', 'support');
                window.location.href = 'pages/Home/index.html';
            });
        } else {
            console.log(resposta);
            resposta.text().then(error => {
                authentitation_failed(error);
            });
        }
    });
}

function agency_authentication(form) {
    fetch("/agencia/autenticar", {
        method: "POST",
        body: form
    }).then(resposta => {
        if (resposta.ok) {
            resposta.json().then(json => {
                sessionStorage.setItem('nomeAgencia', json.nome);
                sessionStorage.setItem('numAgencia', json.numAgencia);
                sessionStorage.setItem('mode', 'agency');
                window.location.href = 'pages/Home/index.html';
            });
        } else {
            console.log(resposta);
            resposta.text().then(error => {
                authentitation_failed(error);
            });
        }
    });
}

function authentitation_failed(error) {
    const error_message = error;
    message.innerHTML = error_message;
    loading.style = "display: none";
    show_login_components(true);
}

function forgot_password() {
    hide_login_components();
    setTimeout(() => {
        brand.style = "display: flex";
        message.style = "display: block; font-size: 1.2em; color: rgba(0,0,0,0.7)";
        message.innerHTML = 'Informe seu email e mandaremos um meio de recuperação de senha';
        email.style = "display: block";
        btSend.style = "display: block";
        btCancel.style = "display: block";
    }, 990);    
}

function validate_email(){
    if(email.value.indexOf('@')>0 && email.value.indexOf('.com')>0){
        const form = new URLSearchParams(new FormData(form_login));
        search_id(form);
    }else{
        email.style="display: block; border-color: red"
    }
}

function search_id(form) {
    hide_forgot_password_components();

    loading_msg.innerHTML = "<span>A</span>guarde um momento"; 
    setTimeout(() => {
        loading.style = "display: flex";
    }, 990);

    fetch("/funcionarioSuporte/recuperarId", {
        method: "POST",
        body: form
    }).then(resposta => {
        if (resposta.ok) {
            resposta.json().then(json => {
                send_email(json[0].idFuncionarioSuporte, json[0].email);
            });
        } else {
            console.log(resposta);
            resposta.text().then(error => {
                send_error(error);
            });
        }
    });
}

function send_email(idFuncionarioSuporte, email) {
    fetch(`sendEmail/sendEmail/${idFuncionarioSuporte}/${email}`)
        .then(resposta => {
            if (resposta.ok) {
                resposta.text().then(texto => {
                    send_success(texto);
                });
            } else {
                resposta.text().then(error => {
                    console.log(error);
                    send_error(error);
                })
            }
        });
}

function send_success(msg) {
    setTimeout(() => {
        loading_msg.style = "animation: fade_out 1000ms";
        loading_gif.style = "animation: fade_out 2000ms";
    }, 1000);

    setTimeout(() => {
        loading_gif.style = "display: none";
        loading_msg.style = "animation: fade_in 1000ms";
        loading_msg.innerHTML = msg;
    }, 2000);

    setTimeout(() => {
        email.value = "";
        loading_gif.style = "display: block";
        loading.style = "display: none";
        show_login_components();
    }, 5000);
}

function send_error(err) {
    setTimeout(() => {
        loading_msg.style = "animation: fade_out 1000ms";
        loading_gif.style = "animation: fade_out 2000ms";
    }, 1000);

    setTimeout(() => {
        loading_gif.style = "display: none";
        loading_msg.style = "animation: fade_in 1000ms";
        loading_msg.innerHTML = err;
    }, 2000);

    setTimeout(() => {
        loading_gif.style = "display: block";
        loading.style = "display: none";
        forgot_password();
    }, 5000);
}


function hide_forgot_password_components() {
    brand.style = "animation: fade_out 800ms";
    message.style = "animation: fade_out 800ms; font-size: 1.2em; color: rgba(0,0,0,0.7)";
    email.style = "display: block; animation: move_right_out 1000ms !important";
    btSend.style = "display: block; animation: fade_out 1000ms 200ms";
    btCancel.style = "display: block; animation: fade_out 1000ms 300ms";

    setTimeout(() => {
        brand.style = "display: none";
        message.style = "display: none";
        message.innerHTML = "";
        email.style = "display: none";
        btSend.style = "display: none";
        btCancel.style = "display: none";
    }, 790);
}

function back_to_login() {
    hide_forgot_password_components();
    setTimeout(() => {
        show_login_components();
    }, 1000);
}