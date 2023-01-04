package com.example.demo.controller;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.database.ConnessioneDatabase;

@RestController
@CrossOrigin
public class AdminController {
	
	private Connection connection;

    public AdminController() {
        try {
            connection = ConnessioneDatabase.getInstance().getConnection();
        } catch (SQLException e) {

            e.printStackTrace();
        }
    };

    @RequestMapping("/admin/api/login/{email}/{password}")
    public boolean loginAdmin(@PathVariable String email,@PathVariable String password) {
        try {
            PreparedStatement loginAdminPS = connection.prepareStatement(
                    "SELECT * FROM AMMINISTRATORE WHERE EMAIL='" + email + "' AND PASSWORD='" + password + "'"
            );
            ResultSet rs = loginAdminPS.executeQuery();
            if (!rs.next())
                return false;
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return true;
    }

}
