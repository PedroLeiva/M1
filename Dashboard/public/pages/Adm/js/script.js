const headDados = document.getElementById('headDados');
const conteudoDados = document.getElementById('conteudo_card');
const img = document.getElementById('img_detalhes');

var validado_nome = false;
var validado_cpf = false;
var validado_telefone = false;
var validado_email = false;
var validado_senha = false;

let extend = false;

window.onload = start_session(), buscarSuporte(ExibirNaTabela), setId();

function setId() {
    numAgencia = sessionStorage.getItem('numAgencia');
    document.getElementById("numAgencia").setAttribute('value', numAgencia);
}

function validarNome(){
    if(i1.value.length > 3){
        i1.style = 'border: 1px solid green;';
        validado_nome = true;   
    }else{
        i1.style = 'border: 1px solid red;';
        validado_nome = false;
    }
}

function validarCPF(){
    if(i2.value.length == 14){
        i2.style = 'border: 1px solid green;';
        validado_cpf = true;
    }else{
        i2.style = 'border: 1px solid red;';
        validado_cpf = false;
    }
}

function validarTelefone(){
    if(i3.value.length < 15){
        i3.style = 'border: 1px solid red;';
        validado_telefone = false;
    }else{
        i3.style = 'border: 1px solid green;';
        validado_telefone = true;
    }
}

function validarEmail(){
    if(i4.value.indexOf('@') > 1 && i4.value.indexOf('.com')>1){
        i4.style = 'border: 1px solid green;';
        validado_email = true;
    }else{
        i4.style = 'border: 1px solid red;';
        validado_email = false;
    }
}

function validarSenha(){
    if(i5.value.length < 3){
        i5.style = 'border: 1px solid red;';
        validado_senha = false;
    }else{
        i5.style = 'border: 1px solid green;';
        validado_senha = true;
    }
}

function validarCampos(action) {
    event.preventDefault();
    const form = new URLSearchParams(new FormData(form_cadastro));

    if(validado_nome && validado_cpf && validado_telefone && validado_email && validado_senha){
        if (action) {
            cadastrarSuporte(form);
        }else{
            editarSuporte(form);
        }
    }else{
        validarNome();
        validarCPF();
        validarTelefone();
        validarEmail();
        validarSenha();
    }
}

function cadastrarSuporte(form) {
    event.preventDefault();
    fetch(`/funcionarioSuporte/cadastrar`, {
        method: "POST",
        body: form
    }).then(resposta => {
        if (resposta.ok) {
            resposta.text().then(texto => {
                alertaSucesso(texto);
                buscarSuporte(ExibirNaTabela);
            });
        } else {
            resposta.text().then(error => {
               alertaErro(error);
            });
        }
    });
}

function editarSuporte() {
    event.preventDefault();
    const form = new URLSearchParams(new FormData(form_cadastro));
    fetch(`/funcionarioSuporte/editar`, {
        method: "POST",
        body: form
    }).then(resposta => {
        if (resposta.ok) {
            resposta.text().then(texto => {
                alertaSucesso(texto);
                restartButtonAndForm();
                buscarSuporte(ExibirNaTabela);
            });
        } else {
            resposta.text().then(error => {
               alertaErro(error);
            });
        }
    });
}

function alertaExcluirSuporte(id) {
      swal.fire({
        title: 'Tem certeza?',
        text: "Ao confirmar, o funcionário será excluído permanentemente!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, confirmar',
        cancelButtonText: 'Não, cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
            excluirSuporte(id);
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swal.fire(
            'Cancelado',
            'Você escolheu não excluir o funcionário :)',
            'error'
          )
        }
      })
}

function excluirSuporte(id){
    event.preventDefault();
    fetch(`/funcionarioSuporte/excluir/${id}`, {
        method: "GET"
    }).then(resposta => {
        if (resposta.ok) {
            resposta.text().then(texto => {
                alertaSucesso(texto);
                buscarSuporte(ExibirNaTabela);
            });
        } else {
            resposta.text().then(error => {
               alertaErro(error);
            });
        }
    });
}

function buscarSuporte(callback) {
    let numAgencia = Number(sessionStorage.getItem("numAgencia"));
    fetch(`/funcionarioSuporte/buscarSuporte/${numAgencia}`, {
        method: "GET"
    }).then(resposta => {
        if (resposta.ok) {
            resposta.json().then(json => {
                callback(json);
            })
        }
    });
}

function preencherCampos(funcionario) {
    details_open();
    document.getElementById("i0").value=funcionario.idFuncionarioSuporte;
    document.getElementById("i1").value=funcionario.nomeCompleto;
    document.getElementById("i2").value=funcionario.cpf;
    document.getElementById("i3").value=funcionario.telefone;
    document.getElementById("i4").value=funcionario.email;
    document.getElementById("i5").value=funcionario.senha;
    formatarCPF();
    formatarTelefone();
    validarNome();
    validarEmail();
    validarSenha();
}

function ExibirNaTabela(funcionariosSuporte) {
    let table = document.getElementById('div_cont');

    table.innerHTML = '';

    funcionariosSuporte.forEach(funcionario => {
        table.innerHTML += `
            <div class="table_row">
                <p class="data">${funcionario.idFuncionarioSuporte}</p>
                <p class="data">${funcionario.nomeCompleto}</p>
                <p class="data">${formatarCPF_tabela(funcionario.cpf)}</p>
                <p class="data">${formatarTelefone_tabela(funcionario.telefone)}</p>
                <p class="data">${funcionario.email}</p>
                <a class="delete" id="editar${funcionario.idFuncionarioSuporte}"><img src="../../img/icons/edit.svg"></a>
                <a class="delete" id="${funcionario.idFuncionarioSuporte}" onclick="alertaExcluirSuporte(this.id)"><img src="../../img/icons/trash-2.svg"></a>
            </div>`;
            setTimeout(() => {
                document.getElementById(`editar${funcionario.idFuncionarioSuporte}`).onclick = () => {
                    preencherCampos(funcionario)
                }; 
             }, 1000);
    });
}

function limparCampos(){
    for (let index = 0; index < 6; index++) {
        document.getElementById(`i${index}`).value='';
        document.getElementById(`i${index}`).style='border: 1px solid rgba(60, 60, 60, 0.4);';
    }
}

function alertaSucesso(texto){
    limparCampos();
    resetarValidacoes()
    Swal.fire(
        'Sucesso',
        texto,
        'success'
    );
}

function alertaErro(error){
    Swal.fire(
        'Ops...',
        error,
        'error'
    );
}

function details() {
    if (!extend) {
        extend = true;
        headDados.style.height = '260px';

        setTimeout(() => {
            conteudoDados.style.display = 'block';
            conteudoDados.style = 'animation: fade_in 800ms;';
            document.querySelector(".table").style.height = '150px';
            document.querySelector(".tituloInformacoes").style.height = '150px';
        }, 100);
        img.src = "../../img/icons/recolher-simbolo-enabled.png";

    } else {
        restartButtonAndForm()
        limparCampos()
        resetarValidacoes()
        extend = false;
        headDados.style.height = '60px';
        conteudoDados.style.display = 'none';
        img.src = '../../img/icons/expandindo-o-simbolo-disabled.png';
        document.querySelector(".table").style.height = '300px';
        document.querySelector(".tituloInformacoes").style.height = '300px';
    }
}

function details_open() {
        changeButtonAndForm()
        headDados.style.height = '260px';

        setTimeout(() => {
            conteudoDados.style.display = 'block';
            conteudoDados.style = 'animation: fade_in 800ms;'
        }, 100);
        img.src = "../../img/icons/recolher-simbolo-enabled.png";
}

function changeButtonAndForm(){
    document.getElementById('cadastrar_suporte').style = "display: none";
    document.getElementById('editar_suporte').style = "display: block";
    document.getElementById('form_cadastro').setAttribute("onsubmit", "return validarCampos(false)");
}

function restartButtonAndForm(){
    document.getElementById('editar_suporte').style = "display: none";
    document.getElementById('cadastrar_suporte').style = "display: block";
    document.getElementById('form_cadastro').setAttribute("onsubmit", "return validarCampos(true)");
}

function formatarCPF(){
    var v=i2.value.replace(/D/g,"")                    
    v=v.replace(/(\d{3})(\d)/,"$1.$2")       
    v=v.replace(/(\d{3})(\d)/,"$1.$2")       
    v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2") 
    i2.value = v;
    validarCPF();
}

function formatarTelefone(){
    var r = i3.value.replace(/\D/g, "");
    r = r.replace(/^0/, "");
    if (r.length > 10) {
      r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (r.length > 5) {
      r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (r.length > 2) {
      r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
    } else {
      r = r.replace(/^(\d*)/, "($1");
    }
    i3.value=r;
    validarTelefone();
}

function formatarTelefone_tabela(telefone){
    var r = telefone.replace(/\D/g, "");
    r = r.replace(/^0/, "");
    if (r.length > 10) {
      r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (r.length > 5) {
      r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (r.length > 2) {
      r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
    } else {
      r = r.replace(/^(\d*)/, "($1");
    }
    return r
}

 function formatarCPF_tabela(cpf){
    var v=cpf.replace(/D/g,"")                    
    v=v.replace(/(\d{3})(\d)/,"$1.$2")       
    v=v.replace(/(\d{3})(\d)/,"$1.$2")       
    v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2") 
    return v
}

function resetarValidacoes(){
    validado_nome = false;
    validado_cpf = false;
    validado_telefone = false;
    validado_email = false;
    validado_senha = false;
}

