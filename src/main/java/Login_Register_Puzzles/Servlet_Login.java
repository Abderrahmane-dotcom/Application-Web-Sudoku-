package Login_Register_Puzzles;

import java.io.IOException;  
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import hashing.hashing_class;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
@WebServlet("/login")
public class Servlet_Login extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        // Enregistrer le nom d'utilisateur dans la session

        
        // Connexion à la base de données
        String jdbcUrl = "jdbc:mysql://localhost:3305/players_database";
        String dbUser = "root";
        String dbPassword = "abderrahmane2003";
        try {
			Class.forName("com.mysql.jdbc.Driver");    //cette petite ligne !!!!!
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        System.out.println(password);
        try (Connection conn = DriverManager.getConnection(jdbcUrl, dbUser, dbPassword)) {
            // Requête SQL pour vérifier les informations d'identification
        	// Générer un salt aléatoire avec un coût de 10


            // Hasher le mot de passe avec le salt
            password = hashing_class.hashPassword(password); 
        	System.out.println(password);
        	// il faut hasher le password
            String sql = "SELECT * FROM user_password WHERE User = ? AND Password = ?";
            PreparedStatement statement = conn.prepareStatement(sql);
            statement.setString(1, email);
            statement.setString(2, password);

            ResultSet result = statement.executeQuery();

            if (result.next()) {
                // Les informations d'identification sont valides
                // Redirection vers une autre page
            	response.sendRedirect("http://localhost:8083/zPFA_Sudoku/index.html?email=" + email);
                System.out.println("la connexion est bien établie");
                conn.close();
            } else {
                // Les informations d'identification sont invalides
                // Affichage d'une alerte
            	
            	response.sendRedirect("http://localhost:8083/zPFA_Sudoku/login.html?message= Identifiants invalides !");
            	response.getWriter().println("<script>alert('Identifiants invalides');</script>");
            	conn.close();
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}