window.onload = start_session(), verificarModo();

function verificarModo() {
    const mode = sessionStorage.getItem('mode');

    if (mode == "support") {
        buscarIncidentes();
    } else if (mode == "agency") {
        buscarTodosIncidentes();
    }
}

function buscarIncidentes() {
    let idFuncionarioSuporte = Number(sessionStorage.getItem("idFuncionarioSuporte"));

    fetch(`/incidente/buscarIncidentes/${idFuncionarioSuporte}`, {
        method: "GET"
    }).then(resposta => {
        if (resposta.ok) {
            resposta.json().then(json => {
                filtrarIncidentes(json);
            });
        }
    });
}

function buscarTodosIncidentes() {
    fetch(`/incidente/buscarTodosIncidentes`, {
        method: "GET"
    }).then(resposta => {
        if (resposta.ok) {
            resposta.json().then(json => {
                filtrarIncidentes(json);
            });
        }
    });
}

function filtrarIncidentes(incidentes) {
    let incidentesAbertos = [];
    let incidentesFinalizados = [];

    incidentes.forEach(incidente => {
        if (incidente.statusIncidente == true) {
            incidentesAbertos.push(incidente)
        } else {
            incidentesFinalizados.push(incidente)
        }
    });

    listarIncidentesAbertos(incidentesAbertos);
    listarIncidentesFinalizados(incidentesFinalizados);
}

function listarIncidentesAbertos(incidentes) {
    let incidentesAbertos = document.getElementById("incidentes_abertos_list");
    incidentesAbertos.innerHTML = `<span class="incidentes_titulo"><span style="color: #F3B700;">A</span>bertos:</span>`;
    incidentes.forEach(incidente => {
        incidentesAbertos.innerHTML += `
                <div class="card_incidente" id="card${incidente.idIncidente}" style="height: 80px;">
                <div class="headDados">
                    <div class="dados_incidente">
                        <div class="dado">
                            <p>Número:</p>
                            <span>${incidente.idIncidente}</span>
                        </div>
                        <div class="dado">
                            <p>Dispositivo:</p>
                            <span>${incidente.hostname}</span>
                        </div>
                        <div class="dado">
                            <p>Tipo de incidente:</p>
                            <span>${incidente.tipoIncidente}</span>
                        </div>
                        <div class="dado">
                            <p>Aberto em:</p>
                            <span>${separarData(incidente.dataHoraInicio)}</span>
                        </div>
                    </div>
                    <div class="opcoes">
                        <div class="concluir">
                            <a href="#realizar_finalizacao" onclick="preencherDadosModal(${incidente.idIncidente}, '${incidente.hostname}', ${incidente.usoCpu}, ${converterBytesParaGigas(incidente.usoRam).toFixed(1)}, ${calcularPorcentagem(incidente.hd, incidente.usoDisco)})"><img src="img/check-disabled.svg"></a>
                        </div>
                        <div class="detalhes" id="btn_details${incidente.idIncidente}">
                            <img class='img_detalhes' src="img/details-disabled.png" id="img_card${incidente.idIncidente}" onclick="details(card${incidente.idIncidente},conteudo_card${incidente.idIncidente},img_card${incidente.idIncidente})">
                        </div>
                    </div>
                </div>
                <div style="display: none;" class="exibir_conteudo_dados" id="conteudo_card${incidente.idIncidente}">
                    <div class="div-dados-exibidos">
                        <p>Dados de uso:</p>
                        <div class="dados-exibidos">
                            <div class="dado">
                                <p>CPU:</p>
                                <span>${incidente.usoCpu.toFixed(1)}%</span>
                            </div>
                            <div class="dado">
                                <p>RAM:</p>
                                <span>${converterBytesParaGigas(incidente.usoRam).toFixed(1)} GB</span>
                            </div>
                            <div class="dado">
                                <p>Disco:</p>
                                <span>${calcularPorcentagem(incidente.hd, incidente.usoDisco).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
    });
}

function fecharModal() {
    window.location.href = "#";
    limparForm();
}

function limparForm() {
    idIncidente.value = "";
    descricao_incidente.value = "";
}

function preencherDadosModal(idIncidente, hostname, usoCpu, usoRam, usoDisco) {
    idIncidenteModal.textContent = idIncidente;
    hostnameModal.textContent = hostname;
    usoCpuModal.textContent = usoCpu.toFixed(1) + "%";
    usoRamModal.textContent = usoRam + " GB";
    usoDiscoModal.textContent = usoDisco.toFixed(1) + "%";
    setId(idIncidente);
}

function setId(id) {
    idIncidente.value = id;
}

function alertaFinalizarIncidente() {
    event.preventDefault();
    swal.fire({
        title: 'Tem certeza?',
        text: "Ao confirmar, o incidente será finalizado",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, confirmar',
        cancelButtonText: 'Não, cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            finalizarIncidente();
        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swal.fire(
                'Cancelado',
                'Você escolheu não finalizar o incidente :)',
                'error'
            )
        }
    })
}

function finalizarIncidente() {
    event.preventDefault();
    const form = new URLSearchParams(new FormData(form_finalizar));
    console.log(form);
    fetch(`/incidente/finalizarIncidente`, {
        method: "PUT",
        body: form
    }).then(resposta => {
        if (resposta.ok) {
            resposta.text().then(texto => {
                alertaSucesso(texto);
                verificarModo();
            });
        } else {
            resposta.text().then(error => {
                alertaErro(error);
            });
        }
    });
}

function alertaSucesso(texto) {
    fecharModal();
    Swal.fire(
        'Sucesso',
        texto,
        'success'
    );
}

function alertaErro(error) {
    Swal.fire(
        'Ops...',
        error,
        'error'
    );
}

function listarIncidentesFinalizados(incidentes) {
    console.log(incidentes);
    let incidentesFinalizados = document.getElementById("incidentes_finalizados_list");
    incidentesFinalizados.innerHTML = `<span class="incidentes_titulo"><span style="color: #F3B700;">F</span>inalizados:</span>`;
    incidentes.forEach(incidente => {
        incidentesFinalizados.innerHTML += `
                <div class="card_incidente_relatorio" id="card_f${incidente.idIncidente}" style="height: 80px;">
                <div class="headDados">
                    <div class="dados_incidente">
                        <div class="dado">
                            <p>Número:</p>
                            <span>${incidente.idIncidente}</span>
                        </div>
                        <div class="dado">
                            <p>Dispositivo:</p>
                            <span>${incidente.hostname}</span>
                        </div>
                        <div class="dado">
                            <p>Tipo de incidente:</p>
                            <span>${incidente.tipoIncidente}</span>
                        </div>
                        <div class="dado">
                            <p>Finalizado em:</p>
                            <span>${separarData(incidente.dataHoraInicio)}</span>
                        </div>
                    </div>
                    <div class="opcoes">
                        <div class="detalhes" id="btn_details_f${incidente.idIncidente}">
                            <img class='img_detalhes' src="img/details-disabled.png" id="img_card_f${incidente.idIncidente}" onclick="details_f(card_f${incidente.idIncidente},conteudo_card_f${incidente.idIncidente},img_card_f${incidente.idIncidente})">
                        </div>
                    </div>
                </div>
                <div style="display: none;" class="exibir_dados_relatorio" id="conteudo_card_f${incidente.idIncidente}">
                    <div class="div-dados-exibidos">
                        <p>Dados de uso:</p>
                        <div class="dados-exibidos">
                            <div class="dado">
                                <p>CPU:</p>
                                <span>${incidente.usoCpu.toFixed(1)}%</span>
                            </div>
                            <div class="dado">
                                <p>RAM:</p>
                                <span>${converterBytesParaGigas(incidente.usoRam).toFixed(1)} GB</span>
                            </div>
                            <div class="dado">
                                <p>Disco:</p>
                                <span>${calcularPorcentagem(incidente.hd, incidente.usoDisco).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="mensagem_relatorio">
                        <p>Descrição:</p>
                        <textarea disabled>${incidente.descricaoIncidente}</textarea>
                    </div>
                </div>
                </div>`
    });
}

function details(idIncidente, idConteudo, img_card) {
    if (idIncidente.style.height === '80px') {
        idIncidente.style.height = '150px';
        img_card.src = 'img/details-enabled.png';

        setTimeout(() => {
            idConteudo.style.display = 'block';
        }, 300);
    } else {
        idIncidente.style.height = '80px';
        idConteudo.style.display = 'none';
        img_card.src = 'img/details-disabled.png';
    }
}

function details_f(idIncidente_r, idConteudo_r, img_card_r) {
    if (idIncidente_r.style.height === '80px') {
        idIncidente_r.style.height = '350px';
        img_card_r.src = 'img/details-enabled.png';

        setTimeout(() => {
            idConteudo_r.style.display = 'block';
        }, 300);
    } else {
        idIncidente_r.style.height = '80px';
        idConteudo_r.style.display = 'none';
        img_card_r.src = 'img/details-disabled.png';
    }
}