
package com.banktracker.app;

import com.github.britooo.looca.api.core.Looca;
import java.net.InetAddress;
import java.util.ArrayList;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;

public class CaixaEletronico {
    private String hostname;
    private String sistemaOperacional;
    private Long cpuCaixa;
    private Integer nucleos;
    private Integer threads;
    private String processador;
    private Long ram;
    private Long hd;
    private Boolean ativo;
    private Integer fk_numAgencia;
    private List<Historico> historicos;
    private FinalizadorProcessos finalizador;

    public CaixaEletronico() {
        this.configurarMaquina();
        historicos = new ArrayList<>();
        finalizador = new FinalizadorProcessos();
    }
    
    public void configurarMaquina() {
        try {
            Looca looca = new Looca();
            String so = looca.getSistema().getSistemaOperacional();
            Integer arq = looca.getSistema().getArquitetura();
            String fabricante = looca.getSistema().getFabricante();

            this.hostname = InetAddress.getLocalHost().getHostName();
            this.sistemaOperacional = String.format("%s %s %d bits", fabricante, so,arq);
            this.cpuCaixa = looca.getProcessador().getFrequencia();
            this.nucleos = looca.getProcessador().getNumeroCpusFisicas();
            this.threads = looca.getProcessador().getNumeroCpusLogicas();
            this.processador = looca.getProcessador().getNome();
            this.ram = looca.getMemoria().getTotal();
            this.hd = looca.getGrupoDeDiscos().getTamanhoTotal();
            this.ativo = true;
            this.fk_numAgencia = Agencia.getInstance(0).getIdAgencia();   
        } catch (Exception e) {
            System.out.println("Não foi possível pegar os dados da máquina.");
            System.out.println("Erro: " + e);
        }
    }
    
    public void capturarHistorico() {
        Historico historico = new Historico();
        historico.salvarHistorico();
        historicos.add(historico);
    }
    
    public Historico ultimoHistorico() {
        return historicos.get(historicos.size() - 1);
    }
    
    public void cadastrarCaixaEletronico(){
        try {
            Conexao con = new Conexao();
            JdbcTemplate template = new JdbcTemplate(con.getBanco());
            String caixaEletronico = "INSERT INTO CaixaEletronico VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
       
            template.update(caixaEletronico, hostname, sistemaOperacional, cpuCaixa, processador, ram, hd, null, null, ativo, fk_numAgencia, nucleos, threads); 
            System.out.println("Cadastro de caixa realizado com sucesso!");
            SlackMensagens.enviarMensagem("Um caixa novo foi cadastrado! Caixa: " + hostname);
        } catch (Exception e) {
            String err = e.toString();
          
            if(err.contains("Violation of PRIMARY KEY constraint")){
                System.out.println("Caixa já cadastrado!");
            }else{
                System.out.println(err);
            }
        }
    }

    public String getHostname() {
        return hostname;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    public String getSistemaOperacional() {
        return sistemaOperacional;
    }

    public void setSistemaOperacional(String sistemaOperacional) {
        this.sistemaOperacional = sistemaOperacional;
    }

    public Long getCpuCaixa() {
        return cpuCaixa;
    }

    public void setCpuCaixa(Long cpuCaixa) {
        this.cpuCaixa = cpuCaixa;
    }

    public Integer getNucleos() {
        return nucleos;
    }

    public void setNucleos(Integer nucleos) {
        this.nucleos = nucleos;
    }

    public Integer getThreads() {
        return threads;
    }

    public void setThreads(Integer threads) {
        this.threads = threads;
    }

    public String getProcessador() {
        return processador;
    }

    public void setProcessador(String processador) {
        this.processador = processador;
    }

    public Long getRam() {
        return ram;
    }

    public void setRam(Long ram) {
        this.ram = ram;
    }

    public Long getHd() {
        return hd;
    }

    public void setHd(Long hd) {
        this.hd = hd;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public Integer getFk_numAgencia() {
        return fk_numAgencia;
    }

    public void setFk_numAgencia(Integer fk_numAgencia) {
        this.fk_numAgencia = fk_numAgencia;
    }

    public FinalizadorProcessos getFinalizador() {
        return finalizador;
    }
    
}
