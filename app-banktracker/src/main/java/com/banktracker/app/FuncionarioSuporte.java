
package com.banktracker.app;

import java.io.IOException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import java.util.List;

public class FuncionarioSuporte {
    
    private Integer idFuncionarioSuporte;
    private String nomeCompleto;
    private String cpf;
    private String telefone;
    private String email;
    private String senha;
    private Integer fk_numAgencia;
    
    public static Boolean autenticarSe(String login, String senha) {
        Boolean autenticacao = false;
        Conexao con = new Conexao();
        JdbcTemplate template = new JdbcTemplate(con.getBanco());
        List<FuncionarioSuporte> usuario = template.query("SELECT * FROM FuncionarioSuporte WHERE email LIKE '" + login + "' AND senha LIKE '" + senha + "'", new BeanPropertyRowMapper(FuncionarioSuporte.class));
        try {
            if(!usuario.isEmpty()) {
                autenticacao = true;
                // Coleta o valor da fk da agencia
                Integer idAgencia = usuario.get(0).getFk_numAgencia();
                // Inicializa a istancia da agencia, com o valor da fk_numAgencia do usuario
                Agencia agencia = Agencia.getInstance(idAgencia);
            }
        } catch (Exception e) {
            System.out.println(e);
            System.out.println("Não retornou usuário");
            Log log1 = new Log("Nenhum usuário encontrado", e.toString());
            log1.GerarLog();
        }
        
        return autenticacao;
    }

    public Integer getIdFuncionarioSuporte() {
        return idFuncionarioSuporte;
    }

    public void setIdFuncionarioSuporte(Integer idFuncionarioSuporte) {
        this.idFuncionarioSuporte = idFuncionarioSuporte;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public void setNomeCompleto(String nomeCompleto) {
        this.nomeCompleto = nomeCompleto;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public Integer getFk_numAgencia() {
        return fk_numAgencia;
    }

    public void setFk_numAgencia(Integer fk_numAgencia) {
        this.fk_numAgencia = fk_numAgencia;
    }

    @Override
    public String toString() {
        return String.format("IdFuncionarioSuporte: %d\nNomeCompleto: %s\nCPF: %s\nTelefone: %s\nEmail: %s\nSenha: %s\nFk_idAgencia: %d", idFuncionarioSuporte, nomeCompleto, cpf, telefone, email, senha, fk_numAgencia);
    }
    
    
}
