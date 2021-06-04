function calcularPorcentagem(capacidade, emuso) {
    let total;
    let uso;
    if(Number.isInteger(capacidade) && Number.isInteger(emuso)) {
        total = converterBytesParaGigas(capacidade);
        uso = converterBytesParaGigas(emuso);
    } else {
        total = capacidade;
        uso = emuso;
    }
    let porcentagem = (uso * 100) / total;
    return porcentagem;
}

function converterBytesParaGigas(bytes) {
    let gigas = Number(bytes/1e+9);
    return gigas;
}

function converterDataEHorarioParaBr(dataHorario) {
    let data = dataHorario.slice(0, dataHorario.indexOf('T'));
    let horario = dataHorario.slice((dataHorario.indexOf('T') + 1), (dataHorario.length -5))
    return `${data} às ${horario}`; 
}

function separarData(dataHorario) {
    //2021-05-27T21:56:29.613Z
    let dia = dataHorario.substring(8, 10)
    let mes = dataHorario.substring(5, 7);
    let ano = dataHorario.substring(0, 4);
    return `${dia}/${mes}/${ano}`
}

function separarHorario(dataHorario) {
    //2021-05-27T21:56:29.613Z
    let inicio = dataHorario.indexOf("T")+1;
    let final = inicio + 5;
    return dataHorario.substring(inicio, final);
}

function validarParaCores(numero) {
    /**
     *  0% - verde - #2B9720
     *  ou 0% - verde - #2ecc71
     *  60% - amarelo - #f1c40f
     *  80% - laranja - #e67e22
     *  100% - vermelho - #d64550
     *  ou 100% - vermelho - #e73c3c
     */
    let valor = numero > 100 ? converterBytesParaGigas(numero) : numero; 
    let cor;
    if(valor > 0 && valor < 60) {
        cor = "#2B9720";
    } else if (valor >= 60 && valor < 80) {
        cor = "#e67e22";
    } else if(valor >= 80 && valor <= 100){
        cor = "#d64550";
    } else {
        cor = 'rgba(99, 99, 99, 1)'; 
    }
    return cor;
}

function start_session() {
    const mode = sessionStorage.getItem('mode');

    if (mode == "support") {
        nomeCompleto = sessionStorage.getItem('nomeCompleto');
        numAgencia = sessionStorage.getItem('numAgencia');
        verify_session(nomeCompleto, undefined);
        set_infos(nomeCompleto, numAgencia);

    } else if (mode == "agency") {
        nomeAgencia = sessionStorage.getItem('nomeAgencia');
        numAgencia = sessionStorage.getItem('numAgencia');
        hide_incidents_option();
        verify_session(nomeAgencia, undefined);
        set_infos(nomeAgencia, numAgencia);
    }
}

function hide_incidents_option() {
    setTimeout(() => {
        let icone = document.getElementsByClassName("btn_manutention");
        for (let index = 0; index < icone.length; index++) {
            icone[index].style = "animation: fade_out 0.2s";
            setTimeout(() => {
                icone[index].style = "display: none"  
            }, 180);
          
        }
    }, 500);
}

function verify_session(nomeCompleto, nomeAgencia) {
    if (nomeCompleto == undefined && nomeAgencia == undefined) {
        window.location.href = '/';
    }
}

function set_infos(nome, numero) {
    try {
        document.getElementById('userName').innerText = "Olá, " + nome;
        document.getElementById('agencyNumber').innerText = "Agência: " + numero;
    } catch (error) {
        console.log(error)
    }
}
