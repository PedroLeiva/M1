
package com.banktracker.app;

import com.github.britooo.looca.api.core.Looca;
import com.github.britooo.looca.api.group.discos.Volume;
import java.net.InetAddress;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 *
 * @author Alessandro
 */
public class Historico {
    private Double usoCpu;
    private Long usoRam;
    private Double usoDisco;
    private Double discoLivre;
    private String fk_hostname;
    
    public Historico() {
        this.coletarDadosDeUtilizacao();
    }
    
    public void coletarDadosDeUtilizacao() {
        try {
            Looca looca = new Looca();
            String hostname = InetAddress.getLocalHost().getHostName();

            Double espacoLivre = 0.0;
            List<Volume> volumes = looca.getGrupoDeDiscos().getVolumes();

            for (Volume volume : volumes) { 
               espacoLivre += volume.getDisponivel();
            }

            this.usoCpu = looca.getProcessador().getUso(); 
            this.usoRam = looca.getMemoria().getEmUso(); 
            this.usoDisco = looca.getGrupoDeDiscos().getTamanhoTotal()-espacoLivre;
            this.discoLivre = espacoLivre;
            this.fk_hostname = InetAddress.getLocalHost().getHostName();
        } catch (Exception e) {
            System.out.println("Não foi possível pegar os dados de uso.");
            System.out.println("Erro: " + e);
        }
    }
    
    public void salvarHistorico(){
        try {
            Conexao con = new Conexao();
            JdbcTemplate template = new JdbcTemplate(con.getBanco());
            String Historico = "INSERT INTO Historico VALUES (?, ?, ?, ?, ?)";
            
            Date date = new Date();
            Timestamp dataDeHoje = new Timestamp(System.currentTimeMillis());
       
            template.update(Historico, usoCpu, usoRam, usoDisco, dataDeHoje, fk_hostname); 
//            System.out.println(dataDeHoje);
            System.out.println("Histórico salvo com sucesso");
        } catch (Exception e) {
            System.out.println("Erro ao salvar o histórico");
            System.out.println("Erro: " + e);
        }
    }
    
    public Double getUsoCpu() {
        return usoCpu;
    }

    public void setUsoCpu(Double usoCpu) {
        this.usoCpu = usoCpu;
    }

    public Long getUsoRam() {
        return usoRam;
    }

    public void setUsoRam(Long usoRam) {
        this.usoRam = usoRam;
    }

    public Double getUsoDisco() {
        return usoDisco;
    }

    public void setUsoDisco(Double usoDisco) {
        this.usoDisco = usoDisco;
    }

    public Double getDiscoLivre() {
        return discoLivre;
    }

    public void setDiscoLivre(Double discoLivre) {
        this.discoLivre = discoLivre;
    }
    
    public String getFk_hostname() {
        return fk_hostname;
    }

    public void setFk_hostname(String fk_hostname) {
        this.fk_hostname = fk_hostname;
    }
    
}