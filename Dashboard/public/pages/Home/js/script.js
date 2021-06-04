let timeout = 150;

window.onload = start_session(), buscarCaixas();

function buscarCaixas() {
    let numAgencia = Number(sessionStorage.getItem("numAgencia"));
    fetch(`/caixaEletronico/agencia/${numAgencia}`, {
        method: "GET"
    }).then(resposta => {
        if (resposta.ok) {
            resposta.json().then(json => {
                timeout *= json.length;
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
            ExibirUsoCpu(caixa);
            ExibirUsoDisco(caixa);
            ExibirUsoMemoria(caixa);
        };
        document.getElementById(`btn_manutencao_${caixa.hostname}`).onclick = () => {
            abrirModal(caixa.hostname, historico.idHistorico, historico.usoCpu.toFixed(1), calcularPorcentagem(caixa.ram,historico.usoRam).toFixed(1), calcularPorcentagem(caixa.hd,historico.usoDisco).toFixed(1));
        }; 
    }, timeout);
}

function abrirModal(hostname, idHistorico, cpu, ram, disco) {
    let idFuncionarioSuporte = sessionStorage.getItem('idFuncionarioSuporte');

    // setando informações nos modais
    idFuncionario_modal.value = idFuncionarioSuporte;
    idHistorico_modal.value = idHistorico;
    hostname_modal.innerText = hostname;
    cpu_modal.innerText = cpu+"%";
    ram_modal.innerText = ram+"%";
    disco_modal.innerText = disco+"%";
    window.location.href="#realiza_relatorio";
}

function declararIncidente() {
    event.preventDefault();
    const form = new URLSearchParams(new FormData(form_incidente));
    fetch(`/incidente/criar`, {
        method: "POST",
        body: form
    }).then(resposta => {
        if (resposta.ok) {
            resposta.text().then(texto => {
                alertaSucesso(texto);
            });
        } else {
            resposta.text().then(error => {
               alertaErro(error);
            });
        }
    });
}

function alertaSucesso(texto){
    window.location.href="#";
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

function ExibirUsoCpu(caixa) {
    document.getElementById("processador").innerText = caixa.processador;
    fetch(`/historico/Atm/ten/${caixa.hostname}`, {
        method: "GET"
    }).then(resposta => {
        if (resposta.ok) {
            resposta.json().then(historicos => {
                // Config para o grafico
                let labels = [];
                let data = [];
                for (let i = historicos.length-1; i >= 0; i--) {
                    labels.push(separarHorario(historicos[i].dataHora));
                    data.push(Number(historicos[i].usoCpu.toFixed(1)));                    
                }
                configCpuGraphic.data.labels = labels;
                configCpuGraphic.data.datasets[0].data = data;
                configCpuGraphic.data.datasets[0].borderColor = validarParaCores(data[data.length-1]);
                configCpuGraphic.data.datasets[0].backgroundColor = validarParaCores(data[data.length-1]);
                cpuChart.update();

                // Config para os dados abaixo do grafico
                let ultimoHistorico = historicos[0];
                document.getElementById("utilizacao_cpu").innerText = `${ultimoHistorico.usoCpu.toFixed(1)}%`;
                document.getElementById("nucleos_cpu").innerText = `${caixa.nucleos}`;
                document.getElementById("threads_cpu").innerText = `${caixa.threads}`;
                document.getElementById("velocudade_base_cpu").innerText = `${converterBytesParaGigas(caixa.cpuCaixa)} GHz`;
            });
        }
    });
}

function ExibirUsoDisco(caixa) {
    fetch(`/historico/Atm/${caixa.hostname}`, {
        method: "GET"
    }).then(resposta => {
        if (resposta.ok) {
            resposta.json().then(json => {
                json.forEach(historico => {
                    // Config para o grafico
                    let total = converterBytesParaGigas(caixa.hd).toFixed(2);
                    let emUso = converterBytesParaGigas(historico.usoDisco).toFixed(2); 
                    let disponível = total - emUso; 
                    configDiscoGraphic.data.datasets[0].data = [disponível, emUso]
                    configDiscoGraphic.data.datasets[0].backgroundColor = ['rgba(199, 199, 199, 1)', validarParaCores(calcularPorcentagem(total,emUso))]
                    discoChart.update();

                    // Config para os dados em baixo do grafico
                    document.getElementById("uso_disco").innerText = `${emUso} GB`;
                    document.getElementById("disponivel_disco").innerText = `${disponível.toFixed(2)} GB`;
                    document.getElementById("total_disco").innerText = `${total} GB`; 
                });
            });
        }
    });
}

function ExibirUsoMemoria(caixa) {
    fetch(`/historico/Atm/${caixa.hostname}`, {
        method: "GET"
    }).then(resposta => {
        if (resposta.ok) {
            resposta.json().then(json => {
                json.forEach(historico => {
                    console.log(caixa)
                    console.log(historico)
                    // Config para o grafico
                    let total = converterBytesParaGigas(caixa.ram).toFixed(2);
                    let emUso = converterBytesParaGigas(historico.usoRam).toFixed(2); 
                    let disponível = total - emUso; 
                    configMemoriaGraphic.data.datasets[0].data = [disponível, emUso]
                    configMemoriaGraphic.data.datasets[0].backgroundColor = ['rgba(199, 199, 199, 1)', validarParaCores(calcularPorcentagem(total,emUso))]
                    memoriaChart.update();

                    // Config para os dados em baixo do grafico
                    document.getElementById("uso_memoria").innerText = `${emUso} GB`;
                    document.getElementById("disponivel_memoria").innerText = `${disponível.toFixed(2)} GB`;
                    document.getElementById("total_memoria").innerText = `${total} GB`; 
                });
            });
        }
    });
}

var ctx = document.getElementById('chartCpu').getContext('2d');
var cpuChart = new Chart(ctx, configCpuGraphic = {
    type: 'line',
    data: {
        labels: ['00:00', '00:00', '00:00', '00:00'],
        datasets: [{
            label: 'Uso de CPU em %',
            data: [0, 0, 0, 0],
            backgroundColor: [
                'rgba(33, 33, 33, 0.5)',
            ],
            borderColor: [
                'rgba(33, 33, 33, 0.5)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

/* Disco */
var ctx = document.getElementById('chartDisc').getContext('2d');
var discoChart = new Chart(ctx, configDiscoGraphic = {
    type: 'doughnut',
    data: {
        labels: ['Disponível (GB)','Em uso (GB)'],
        datasets: [{
            data: [0,0],
            backgroundColor: [
                'rgba(199, 199, 199, 1)',
                'rgba(99, 99, 99, 1)',
            ],
            hoverOffset: 4
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

/* Memory */
var ctx = document.getElementById('chartMemory').getContext('2d');
var memoriaChart = new Chart(ctx, configMemoriaGraphic = {
    type: 'bar',
    data: {
        labels: ['Disponível (GB)','Em uso (GB)'],
        datasets: [{
            label: 'Dados da memória',
            data: [0,0],
            fill: false,
            backgroundColor: [
                'rgba(99, 99, 99, 1)',
                'rgba(199, 199, 199, 1)',
            ],
        }]
    },
    options: {
        indexAxis: 'y',
    }
});