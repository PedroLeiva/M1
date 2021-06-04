let timeout = 150;

window.onload = mainRelatorio();

function mainRelatorio() {
    start_session();
    buscarCaixas();
}

function buscarCaixas() {
    //console.log(sessionStorage.getItem("numAgencia"));
    let numAgencia = Number(sessionStorage.getItem("numAgencia"));
    fetch(`/caixaEletronico/agencia/${numAgencia}`, {
        method: "GET"
    }).then(resposta => {
        if (resposta.ok) {
            resposta.json().then(json => {
                // console.log(json);
                timeout *= json.length;
                // console.log(timeout);
                json.forEach(element => {
                    buscarRegistroHistorico(element);
                });
            })
        }
    });
}

function buscarRegistroHistorico(caixa) {
    fetch(`/historico/Atm/${caixa.hostname}`, {
        method: "GET"
    }).then(resposta => {
        if (resposta.ok) {
            resposta.json().then(json => {
                json.forEach(historico => {
                    inserirCaixasNoCarousel(caixa,historico);
                });
            });
        }
    });
}

function inserirCaixasNoCarousel(caixa, historico) {
    let id = caixa.hostname.replaceAll('-', '');
    let divCarousel = document.getElementById("items");
    divCarousel.innerHTML += `
        <div class="card" id="${id}">
            <div class="info_atm">
                <span class="title">${historico.fk_hostname}</span>
                <img src="../../img/atm-icon.png" alt="">
            </div>
            <div class="info_use_atm">
                <div class="info_use">
                    <div class="status" style="background-color:${validarParaCores(historico.usoCpu)};"></div>
                    <div class="info">
                        <p>CPU</p>
                        <span>${historico.usoCpu.toFixed(1)}% ${converterBytesParaGigas(caixa.cpuCaixa).toFixed(2)} GHz</span>
                    </div>
                </div>
                <div class="info_use">
                    <div class="status" style="background-color: ${validarParaCores(calcularPorcentagem(caixa.ram,historico.usoRam).toFixed(2))};"></div>
                    <div class="info">
                        <p>RAM</p>
                        <span>${converterBytesParaGigas(historico.usoRam).toFixed(2)} / ${converterBytesParaGigas(caixa.ram).toFixed(2)} GB</span>
                    </div>
                </div>
                <div class="info_use">
                    <div class="status" style="background-color: ${validarParaCores(calcularPorcentagem(caixa.hd,historico.usoDisco).toFixed(2))};"></div>
                    <div class="info">
                        <p>Disco</p>
                        <span> ${converterBytesParaGigas(historico.usoDisco).toFixed(2)} / ${converterBytesParaGigas(caixa.hd).toFixed(2)} GB</span>
                    </div>
                </div>
            </div>
            <div class="options">
                <div class="btn_exibicao" title="Exibir registros" id="btn_exibicao_${caixa.hostname}">
                    <img src="../../img/icons/eye-disabled.svg" alt="Exibir registros">
                </div>
                <div class="btn_manutention" title="Manutenção" id="btn_manutencao_${caixa.hostname}">
                    <img src="../../img/icons/tool-disabeld.png" alt="Manutenção">
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        document.getElementById(`btn_exibicao_${caixa.hostname}`).onclick = () => {
            document.querySelectorAll('.card').forEach(card => {
                let id = caixa.hostname.replaceAll('-', '');
                card.getAttribute("id") == id ? card.style.borderColor = 'rgba(243, 183, 0, 1)' : card.style.borderColor = 'rgba(60, 60, 60, 0.2)'
            });
            document.querySelectorAll('.hostname').forEach(hostname => {
                hostname.innerText = caixa.hostname;
            });
            exibirDadosNaTable(caixa.hostname);
        };
        document.getElementById(`btn_manutencao_${caixa.hostname}`).onclick = () => {
            console.log('manutention')
        }; 
    }, timeout);    
}

function buscarRegistrosHistorico(hostname) {
    fetch(`/historico/Atm/All/${hostname}`, {
        method: "GET"
    }).then(resposta => {
        if (resposta.ok) {
            resposta.json().then(json => {
                for(let i = 0; i < json.length; i++) {
                    inserirDadosNaTabela(json[i]);
                }
            });
        }
    });
}

function exibirDadosNaTable(hostname) {
    let table = document.getElementById("cont_table");
    table.classList.remove("noSelected");
    table.innerHTML = '';
    buscarRegistrosHistorico(hostname);
}

function inserirDadosNaTabela(historico) {
    let table = document.getElementById("cont_table");
    table.innerHTML += `
        <div class="table_row" id="historico${historico.idHistorico}">
            <p class="data">${historico.idHistorico}</p>
            <p class="data">${separarData(historico.dataHora)}</p>
            <p class="data">${separarHorario(historico.dataHora)}</p>
            <p class="data">${historico.usoCpu.toFixed(1)}%</p>
            <p class="data">${converterBytesParaGigas(historico.usoRam).toFixed(2)}GB</p>
            <p class="data">${converterBytesParaGigas(historico.usoDisco).toFixed(2)} GB</p>
        </div>
    `;
        //<a class="detalhes" id="detalhes${historico.idHistorico}"><img src="../../img/icons/relatorio.png"></a>
}
