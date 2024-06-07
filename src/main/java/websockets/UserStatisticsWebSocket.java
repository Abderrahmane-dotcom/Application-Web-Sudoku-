package websockets;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import java.sql.*;

@ServerEndpoint("/userstatistics")
public class UserStatisticsWebSocket {

    // Cette méthode est appelée lorsqu'un message est reçu sur la WebSocket
    @OnMessage
    public void onMessage(Session session, String email) {
        // Récupérer les statistiques de l'utilisateur correspondant à l'email
        String userStatistics = retrieveUserStatistics(email);

        try {
            // Envoyer les statistiques de l'utilisateur au client via la WebSocket
            session.getBasicRemote().sendText(userStatistics);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Cette méthode récupère les statistiques de l'utilisateur à partir de la base de données
    private String retrieveUserStatistics(String email) {
        String result = "";

        try {
            // Établir la connexion à la base de données
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3305/players_database", "root", "abderrahmane2003");

            // Préparer la requête SQL pour récupérer les données de l'utilisateur
            String sql = "SELECT User_Name, Email, Nmr_prt_joue_facile, Nmr_prt_gagnes_facile,Nmr_prt_joue_moyen, "
            		+ "Nmr_prt_gagnes_moyen, Nmr_prt_joue_difficile, Nmr_prt_gagnes_difficile, Nmr_prt_joue_diabolique, "
            		+ "Nmr_prt_gagnes_diabolique,Meilleur_temps, Score FROM user_statistics WHERE Email = ? " ;

            PreparedStatement statement = conn.prepareStatement(sql);
            statement.setString(1, email);

            // Exécuter la requête SQL
            ResultSet resultSet = statement.executeQuery();

            // Traitement du résultat de la requête
            if (resultSet.next()) {
                // Récupérer les données de l'utilisateur et les formater
                result = formatUserStatistics(resultSet);
            }

            // Fermer les ressources
            resultSet.close();
            statement.close();
            conn.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return result;
    }

    // Cette méthode formate les statistiques de l'utilisateur
    private String formatUserStatistics(ResultSet resultSet) throws SQLException {
        StringBuilder formattedData = new StringBuilder();

        // Exemple de formatage des données sous forme de liste
        formattedData.append("🖥️ Nom utilisateur: ").append(resultSet.getString("User_Name")).append("\n");
        formattedData.append("📧 Email: ").append(resultSet.getString("Email")).append("\n");
        formattedData.append("✏️ Parties jouées (facile): ").append(resultSet.getInt("Nmr_prt_joue_facile")).append("\n");
        formattedData.append("🏆 Parties gagnées (facile): ").append(resultSet.getInt("Nmr_prt_gagnes_facile")).append("\n");
        formattedData.append("✏️ Parties jouées (moyen): ").append(resultSet.getInt("Nmr_prt_joue_moyen")).append("\n");
        formattedData.append("🏆 Parties gagnées (moyen): ").append(resultSet.getInt("Nmr_prt_gagnes_moyen")).append("\n");
        formattedData.append("✏️ Parties jouées (difficile): ").append(resultSet.getInt("Nmr_prt_joue_difficile")).append("\n");
        formattedData.append("🏆 Parties gagnées (difficile): ").append(resultSet.getInt("Nmr_prt_gagnes_difficile")).append("\n");
        formattedData.append("✏️ Parties jouées (diabolique): ").append(resultSet.getInt("Nmr_prt_joue_diabolique")).append("\n");
        formattedData.append("🏆 Parties gagnées (diabolique): ").append(resultSet.getInt("Nmr_prt_gagnes_diabolique")).append("\n");
        formattedData.append("⌛ Meilleur temps: ").append(resultSet.getString("Meilleur_temps")).append("\n");
        formattedData.append("💎 Score: ").append(resultSet.getInt("Score")).append("\n");
        return formattedData.toString();
    }

}
