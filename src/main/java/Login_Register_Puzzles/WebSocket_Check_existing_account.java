package Login_Register_Puzzles;
import jakarta.websocket.OnMessage;
import jakarta.websocket.server.ServerEndpoint;
import jakarta.websocket.Session;
import jakarta.websocket.OnOpen;
import jakarta.websocket.OnClose;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

import org.json.JSONArray;

import com.google.gson.Gson;

@SuppressWarnings("unused")
@jakarta.websocket.server.ServerEndpoint("/check-email-username")
public class WebSocket_Check_existing_account {

    private Connection connect() {
        // Connectez-vous à votre base de données ici
        String url = "jdbc:mysql://localhost:3305/players_database"; // Modifiez l'URL de la base de données
        String user = "root"; // Modifiez le nom d'utilisateur
        String password = "abderrahmane2003"; // Modifiez le mot de passe
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(url, user, password);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return conn;
    }

    @OnOpen
    public void onOpen(Session session) {
        System.out.println("Connected ... " + session.getId());
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        try {
            // Récupérer l'email envoyé par le client
            JSONArray jsonArray = new JSONArray(message);
            
        	String email;
        	String user__name;
        	email = jsonArray.getString(0);
        	user__name = jsonArray.getString(1);      	

            // Vérifier si l'email existe dans la base de données
            Connection conn = connect();
            
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM user_password WHERE User = ?");
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();
            boolean exists = rs.next();
            String response1 = exists ? "exists" : "not_exists";
            
            
            PreparedStatement ps2 = conn.prepareStatement("SELECT * FROM user_statistics WHERE User_Name = ?");
            ps2.setString(1, user__name);
            ResultSet rs2 = ps2.executeQuery();
            boolean exists2 = rs2.next();
            String response2 = exists2 ? "exists" : "not_exists";
            
           System.out.println(user__name);
            
            // pour envoyer une liste jason pour le mail et le username
 
            ArrayList<String> liste = new ArrayList<String>();
                
            // Ajout d'éléments à l'ArrayList
            liste.add(response1);
            liste.add(response2);
            String listeJSON = new Gson().toJson(liste);
            session.getBasicRemote().sendText(listeJSON);
            System.out.println(listeJSON);

            //session.getBasicRemote().sendText(response);
            rs2.close();
            ps2.close();
            rs.close();
            ps.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @OnClose
    public void onClose(Session session) {
        System.out.println("Session " + session.getId() + " closed");
    }
}
