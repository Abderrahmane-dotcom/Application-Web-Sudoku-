package websockets ;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@ServerEndpoint("/top_players")
public class Les_10_meilleurs_joueurs {

    @OnOpen
    public void onOpen(Session session) {
        try {
            // Récupérer les 10 meilleurs joueurs et les envoyer au client WebSocket
            List<String[]> topPlayers = getTopPlayers();
            String topPlayersJson = convertToJson(topPlayers);
            session.getBasicRemote().sendText(topPlayersJson);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    

    // Méthode pour récupérer les 10 meilleurs joueurs depuis la base de données
    private List<String[]> getTopPlayers() {
        try {
			Class.forName("com.mysql.jdbc.Driver");    //cette petite ligne !!!!!
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        List<String[]> topPlayers = new ArrayList<>();
        try {
            // Connexion à la base de données
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3305/players_database", "root", "abderrahmane2003");
            // Requête SQL pour récupérer les 10 meilleurs joueurs
            String sqlQuery = "SELECT User_Name, Score FROM user_statistics ORDER BY Score DESC LIMIT 10";
            PreparedStatement statement = conn.prepareStatement(sqlQuery);
            ResultSet resultSet = statement.executeQuery();
            // Traitement des résultats
            while (resultSet.next()) {
                String userName = resultSet.getString("User_Name");
                String score = resultSet.getString("Score");
                String[] player = {userName, score};
                topPlayers.add(player);
            }
            // Fermeture des ressources
            resultSet.close();
            statement.close();
            conn.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return topPlayers;
    }

    // Méthode pour convertir la liste des joueurs en format JSON
    private String convertToJson(List<String[]> players) {
        StringBuilder jsonBuilder = new StringBuilder();
        jsonBuilder.append("[");
        for (String[] player : players) {
            jsonBuilder.append("{\"User_Name\":\"").append(player[0]).append("\",\"Score\":").append(player[1]).append("},");
        }
        if (!players.isEmpty()) {
            jsonBuilder.deleteCharAt(jsonBuilder.length() - 1); // Supprimer la virgule finale
        }
        jsonBuilder.append("]");
        return jsonBuilder.toString();
    }
}
