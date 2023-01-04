package com.example.demo.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnessioneDatabase {
	

	    // ATTRIBUTI
	    private static ConnessioneDatabase instance;

	    private Connection connection = null;
	    
	    
	    private String nome = "user";
	    private String password = "password";
	    private String url = "jdbc:postgresql://localhost:5432/spring-docker";
	    private String driver = "org.postgresql.Driver";
		
		/*
	    private String nome = "postgres";
	    private String password = "kekkocorrado";
	    private String url = "jdbc:postgresql://localhost:2809/prova";
	    private String driver = "org.postgresql.Driver";
	    */
	    
	    // COSTRUTTORE
	    public ConnessioneDatabase() throws SQLException {
	        try {
	            Class.forName(driver);
	            connection = DriverManager.getConnection(url, nome, password);

	        } catch (ClassNotFoundException ex) {
	            System.out.println("Database Connection Creation Failed : " + ex.getMessage());
	            ex.printStackTrace();
	        }

	    }

	    public Connection getConnection() {
	        return connection;
	    }

	    public static ConnessioneDatabase getInstance() throws SQLException {
	        if (instance == null) {
	            instance = new ConnessioneDatabase();
	        } else if (instance.getConnection().isClosed()) {
	            instance = new ConnessioneDatabase();
	        }
	        return instance;
	    }
	}

