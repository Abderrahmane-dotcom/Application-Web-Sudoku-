package Login_Register_Puzzles;


import hashing.hashing_class;

import java.io.IOException; 
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;


import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
@WebServlet("/register")
public class Servlet_Register extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String username = request.getParameter("username");
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        // Connexion à la base de données
        String jdbcUrl = "jdbc:mysql://localhost:3305/players_database";
        String dbUser = "root";
        String dbPassword = "abderrahmane2003";
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        PreparedStatement stmt1 = null;
        PreparedStatement stmt2 = null;
        try (Connection conn = DriverManager.getConnection(jdbcUrl, dbUser, dbPassword)) {
        	String hashedPassword =hashing_class.hashPassword(password);
        	
        	
        	// Insert into user_password table
        	String insertPasswordQuery = "INSERT INTO user_password (User, Password) VALUES (?, ?)";
        	stmt2 = conn.prepareStatement(insertPasswordQuery);
        	stmt2.setString(1, email);
        	stmt2.setString(2, hashedPassword);
        	stmt2.executeUpdate();
           
        	
        	// Insert into user_statistics table
            String insertStatisticsQuery = "INSERT INTO user_statistics (User_Name, Email, Nmr_prt_joue_facile, Nmr_prt_gagnes_facile, Nmr_prt_joue_moyen, Nmr_prt_gagnes_moyen, Nmr_prt_joue_difficile, Nmr_prt_gagnes_difficile, Nmr_prt_joue_diabolique, Nmr_prt_gagnes_diabolique, Meilleur_temps, Score) VALUES (?, ?, 0, 0, 0, 0, 0, 0, 0, 0, '0 h 0 min 0 s', 0)";
            stmt1 = conn.prepareStatement(insertStatisticsQuery);
            stmt1.setString(1, username);
            stmt1.setString(2, email);
            stmt1.executeUpdate();
            


            // Redirection vers une autre page
            response.sendRedirect("http://localhost:8083/zPFA_Sudoku/index.html?email=" + email);
            
            System.out.println("Inscription réussie");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}