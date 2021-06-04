package com.banktracker.app;

import static com.banktracker.app.SlackBot.slackMensagem;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public final class FinalizadorProcessos {
    
    private List<ProcessoIndesejado> processos = new ArrayList<ProcessoIndesejado>();

    public FinalizadorProcessos() {
        this.buscarProcessosIndesejados();
    }
    
    public void buscarProcessosIndesejados() {
        try {
            Conexao con = new Conexao();
            JdbcTemplate template = new JdbcTemplate(con.getBanco());
            String hostname = InetAddress.getLocalHost().getHostName();

            Integer idAgencia = Agencia.getInstance(null).getIdAgencia();
            processos = template.query("SELECT * FROM ProcessoIndesejado where fk_numAgencia = " + idAgencia, new BeanPropertyRowMapper(ProcessoIndesejado.class));

            //for (ProcessoIndesejado pi : processos) {
            //    System.out.println(pi);
            //}
        } catch (Exception e) {
            System.out.println("Não foi possivel pegar os processos indesejados");
        }
    }

    public void FinalizarProcessos(String hostname, String sistemaOperacional) {
        try {
            for (ProcessoIndesejado processo : processos) {
                if (sistemaOperacional.contains("Windows")) {
                    try {
                        String comando = "tskill " + processo.getNomeProcesso();
                        Process exec = Runtime.getRuntime().exec(comando);
                        SlackMensagens.enviarMensagem("O processo "+ processo.getNomeProcesso() + " foi finalizado no caixa " + hostname );
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } else {
                    try {
                        String comando = "pkill " + processo.getNomeProcesso();
                        Process exec = Runtime.getRuntime().exec(comando);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("Não foi possivel finalizar os processos");
        }
    }

}
