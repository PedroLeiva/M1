package com.banktracker.app;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import org.apache.commons.dbcp2.BasicDataSource;


public class ConexaoDocker {
     Connection conn;
     private BasicDataSource banco;


    public Connection conexaoConteiner() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            String url = "jdbc:mysql://172.17.0.1:3306/bdBankTracker";
            conn = DriverManager.getConnection(url, "root", "urubu100");
            System.out.println("Funcionou");

        } catch (ClassNotFoundException | SQLException e) {

            System.out.println(e);

        }
        return conn;
    }
     public BasicDataSource getBanco() {
        return banco;
    }

}
