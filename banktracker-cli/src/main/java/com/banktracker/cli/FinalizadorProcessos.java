package com.banktracker.cli;

import static com.banktracker.cli.SlackBot.slackMensagem;
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
        try{
        this.buscarProcessosIndesejados();
        }catch(Exception e){
            System.out.println(e);
        }
    }
    
    public void buscarProcessosIndesejados(){
        try{
        Conexao con = new Conexao();
        JdbcTemplate template = new JdbcTemplate(con.getBanco());
        String hostname = InetAddress.getLocalHost().getHostName();

        Integer idAgencia = Agencia.getInstance(null).getIdAgencia();
        processos = template.query("SELECT * FROM ProcessoIndesejado where fk_numAgencia = " + idAgencia, new BeanPropertyRowMapper(ProcessoIndesejado.class));

        }catch(Exception e){
            System.out.println(e);
        }
    }

    public void FinalizarProcessos(String sistemaOperacional){
        try{
        String so = sistemaOperacional;
        String hostname = InetAddress.getLocalHost().getHostName();
        for (ProcessoIndesejado processo : processos) {
            if (so.contains("Windows")) {
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
        }}catch(Exception e){
            System.out.println(e);
        }
    }

}
