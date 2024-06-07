import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.sql.*;

@ServerEndpoint("/websocket_diabolique")
public class WebSocketDiabolique {

    @OnOpen
    public void onOpen(Session session) {
        // Vous pouvez implémenter des actions spécifiques lorsque la connexion WebSocket est ouverte
    }

    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
    		
    	try {
    	    // Récupération de l'e-mail de l'utilisateur depuis le localStorage
    	    String userEmail = message ;// récupérer l'e-mail depuis le localStorage

    	    // Connexion à la base de données MySQL
    	    Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3305/players_database", "root", "abderrahmane2003");

    	    // Récupération de la valeur actuelle de Nmr_prt_joue_diabolique pour l'utilisateur
    	    PreparedStatement selectStmt = conn.prepareStatement("SELECT Nmr_prt_joue_diabolique FROM user_statistics WHERE Email = ?");
    	    selectStmt.setString(1, userEmail);
    	    ResultSet selectRs = selectStmt.executeQuery();

    	    int nmrPrtJouediabolique = 0;
    	    if (selectRs.next()) {
    	        nmrPrtJouediabolique = selectRs.getInt("Nmr_prt_joue_diabolique");
    	    }

    	    // Fermeture des ressources de la requête SELECT
    	    selectRs.close();
    	    selectStmt.close();

    	    // Interrogation de la table diabolique pour récupérer la grille correspondante
    	    PreparedStatement stmt = conn.prepareStatement("SELECT Grille FROM diabolique WHERE no = ?");
    	    stmt.setInt(1, nmrPrtJouediabolique + 1);
    	    ResultSet rs = stmt.executeQuery();

    	    // Envoi de la nouvelle grille au client via la connexion WebSocket
    	    if (rs.next()) {
    	        String grille = rs.getString("Grille");
    	        session.getBasicRemote().sendText(grille);
    	    }

    	    // Fermeture des ressources de la requête sur la table diabolique
    	    rs.close();
    	    stmt.close();

    	    // Mise à jour de la valeur de Nmr_prt_joue_diabolique pour l'utilisateur
    	    PreparedStatement updateStmt = conn.prepareStatement("UPDATE user_statistics SET Nmr_prt_joue_diabolique = ? WHERE Email = ?");
    	    updateStmt.setInt(1, nmrPrtJouediabolique + 1);
    	    updateStmt.setString(2, userEmail);
    	    updateStmt.executeUpdate();

    	    // Fermeture des ressources de la requête UPDATE
    	    updateStmt.close();

    	    // Fermeture de la connexion à la base de données
    	    conn.close();
    	} catch (Exception e) {
    	    e.printStackTrace();
    	}
    }
}
