window.onload = start_session(), buscarProcessos(ExibirProcessosNaTabela), setId();

function setId() {
    numAgencia = sessionStorage.getItem('numAgencia');
    document.getElementById("numAgencia").setAttribute('value', numAgencia);
}

function buscarProcessos(_callback) {
    // console.log(sessionStorage.getItem("numAgencia"));
    let numAgencia = Number(sessionStorage.getItem("numAgencia"));
    fetch(`/processoIndesejado/processoIndesejado/${numAgencia}`, {
        method: "GET"
    }).then(resposta => {
        if (resposta.ok) {
            resposta.json().then(json => {
                _callback(json);
            });
        }
    });
}

function ExibirProcessosNaTabela(response) {
    let table = document.getElementById('cont_table');
    table.innerHTML = '';
    
    response.forEach(processo => {
        table.innerHTML += `
            <div class="table_row" id="processo${processo.idProcessoIndesejado}">
                <p class="data">${processo.idProcessoIndesejado}</p>
                <p class="data">${processo.nomeProcesso}</p>
                <a class="delete" id="btn_delete_processo${processo.idProcessoIndesejado}" onclick="alertaExcluirProcesso(${processo.idProcessoIndesejado})"><img src="../../img/icons/trash-2.svg"></a>
            </div>
        `;
    });
}

function CadastrarProcesso() {
    event.preventDefault();
    const form = new URLSearchParams(new FormData(form_processo)); 
    fetch(`/processoIndesejado/cadastrar`, {
        method: "POST",
        body: form
    }).then(resposta => {
        if (resposta.ok) {
            resposta.text().then(texto => {
                document.getElementById('nome_processo').value = '';
                alertaSucesso(texto);
                buscarProcessos(ExibirProcessosNaTabela);
            });
        }
    });
}

function excluirProcesso(id){
    fetch(`/processoIndesejado/excluir/${id}`, {
        method: "GET"
    }).then(resposta => {
        if (resposta.ok) {
            resposta.text().then(texto => {
                alertaSucesso(texto);
                buscarProcessos(ExibirProcessosNaTabela);
            });
        } else {
            console.log(resposta);
            resposta.text().then(error => {
               alertaErro(error);
            });
        }
    });
}

function alertaSucesso(texto){
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

function alertaExcluirProcesso(id) {
    swal.fire({
      title: 'Tem certeza?',
      text: "Ao confirmar, o processo será excluído permanentemente!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, confirmar',
      cancelButtonText: 'Não, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
          excluirProcesso(id);
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swal.fire(
          'Cancelado',
          'Você escolheu não excluir o processo :)',
          'error'
        )
      }
    })
}