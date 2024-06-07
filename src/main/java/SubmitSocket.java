import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import java.sql.*;

import org.json.JSONArray;
import org.json.JSONException;

@ServerEndpoint("/websocket_submit")
public class SubmitSocket {
	private Connection connection;

    public SubmitSocket() {
        connectToDatabase();
    }

    @OnOpen
    public void onOpen(Session session) {
        System.out.println("Connexion WebSocket ouverte");
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        try {
            // Analyser le message JSON contenant le numéro et le temps de résolution
            int numero;
            String temps;
            String Email;
            try {
                // Analyse de la chaîne JSON envoyée depuis JavaScript
                JSONArray jsonArray = new JSONArray(message);
                System.out.println("Type of str------------------: " + jsonArray.getString(1).getClass().getSimpleName());
                numero = jsonArray.getInt(0);
                temps = jsonArray.getString(1);
                Email = jsonArray.getString(2);
                
            } catch (JSONException e) {
                e.printStackTrace();
                return;
            }

            // Effectuer les changements dans la base de données en fonction du numéro
            if (numero == 0) {
                incrementNmrPrtGagnesFacile(Email);
                incrementScorefacile(Email);
                System.out.println(temps);
                updateMeilleurTemps(temps,Email);
                session.getBasicRemote().sendText(message);
               // connection.close();
               // System.out.println("Connexion fermée avec succès.");
            } else if (numero == 1) {
                incrementNmrPrtGagnesMoyen(Email);
                incrementScoremoyen(Email);
                System.out.println(temps);
                updateMeilleurTemps(temps,Email);
                session.getBasicRemote().sendText(message);
               // connection.close();
              //  System.out.println("Connexion fermée avec succès.");
            }
            else if (numero == 2) {
                incrementNmrPrtGagnesDifficile(Email);
                incrementScorediff(Email);
                System.out.println(temps);
                updateMeilleurTemps(temps,Email);
                session.getBasicRemote().sendText(message);
             //   connection.close();
             //   System.out.println("Connexion fermée avec succès.");
            }
            else if (numero == 3) {
                incrementNmrPrtGagnesDiabolique(Email);
                incrementScorediabo(Email);
                System.out.println(temps);
                updateMeilleurTemps(temps,Email);
                session.getBasicRemote().sendText(message);
             //   connection.close();
             //   System.out.println("Connexion fermée avec succès.");
            }else {
                // Traiter les autres numéros si nécessaire
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void connectToDatabase() {
        try {
            // Établir la connexion à votre base de données
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3305/players_database", "root", "abderrahmane2003");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void incrementNmrPrtGagnesFacile(String Email) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement("UPDATE user_statistics SET Nmr_prt_gagnes_facile = Nmr_prt_gagnes_facile + 1 where Email = ?")) {
        	statement.setString(1, Email);
        	statement.executeUpdate();
        }
    }

    private void incrementNmrPrtGagnesMoyen(String Email) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement("UPDATE user_statistics SET Nmr_prt_gagnes_moyen = Nmr_prt_gagnes_moyen + 1 where Email = ?")) {
        	statement.setString(1, Email);
        	statement.executeUpdate();
        }
    }
    private void incrementNmrPrtGagnesDifficile(String Email) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement("UPDATE user_statistics SET Nmr_prt_gagnes_difficile = Nmr_prt_gagnes_difficile + 1 where Email = ?")) {
        	statement.setString(1, Email);
        	statement.executeUpdate();
        }
    }
    private void incrementNmrPrtGagnesDiabolique(String Email) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement("UPDATE user_statistics SET Nmr_prt_gagnes_diabolique = Nmr_prt_gagnes_diabolique + 1 where Email = ?")) {
        	statement.setString(1, Email);
        	statement.executeUpdate();
        }
    }
    
    
    
    
    
    

    
    
    private void incrementScorefacile(String Email) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement("UPDATE user_statistics SET score = score + 10 where Email =?")) {
        	statement.setString(1, Email);
        	statement.executeUpdate();
        }
    }
    private void incrementScoremoyen(String Email) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement("UPDATE user_statistics SET score = score + 50 where Email =?")) {
        	statement.setString(1, Email);
        	statement.executeUpdate();
        }
    }
    private void incrementScorediff(String Email) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement("UPDATE user_statistics SET score = score + 500 where Email =?")) {
        	statement.setString(1, Email);
        	statement.executeUpdate();
        }
    }
    private void incrementScorediabo(String Email) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement("UPDATE user_statistics SET score = score + 1000 where Email =?")) {
        	statement.setString(1, Email);
        	statement.executeUpdate();
        }
    }
    

    private void updateMeilleurTemps(String temps, String Email) throws SQLException {
        
        try (PreparedStatement statement = connection.prepareStatement("SELECT Meilleur_temps FROM user_statistics where Email=?")) {
        	statement.setString(1, Email);
        	ResultSet resultSet = statement.executeQuery();
            if (resultSet.next()) {
            	
                String meilleurTemps = resultSet.getString("Meilleur_temps");
                System.out.println("fait ou pas");
                System.out.println(meilleurTemps);
                
        
                if (comparerTemps(temps,meilleurTemps)==true || isZeroTime(meilleurTemps)==true) {
                	System.out.println("Condition de mise à jour du meilleur temps satisfaite");
                    String updateQuery = "UPDATE user_statistics SET Meilleur_temps = ? where Email=?";
                    try (PreparedStatement updateStatement = connection.prepareStatement(updateQuery)) {
                        updateStatement.setString(1, (String) temps);
                        updateStatement.setString(2, Email);
                        updateStatement.executeUpdate();
                        System.out.println("fait");
                    }
                }
            }
        }
    }
    public static boolean comparerTemps(String temps1, String temps2) {
        // Convertir les temps formatés en secondes
        int temps1Secondes = convertirEnSecondes(temps1);
        int temps2Secondes = convertirEnSecondes(temps2);
        System.out.println("test fait");
        // Comparer les temps en secondes
        if (temps1Secondes > temps2Secondes) {
        	System.out.println("test fait temps1Secondes > temps2Secondes");
            return false;
        } else {
        	System.out.println("test fait temps1Secondes < temps2Secondes");
            return true;
        }
		 
    }

    public static int convertirEnSecondes(String temps) {
        // Diviser le temps formaté en heures, minutes et secondes
        String[] parties = temps.split(" h | min | s");
        int heures = Integer.parseInt(parties[0]);
        int minutes = Integer.parseInt(parties[1]);
        int secondes = Integer.parseInt(parties[2]);

        // Convertir les heures, minutes et secondes en secondes
        int tempsTotalSecondes = heures * 3600 + minutes * 60 + secondes;
        return tempsTotalSecondes;
    }
    public static boolean isZeroTime(String str) {
    	System.out.println("test fait is wero");
    	return str.equals("0 h 0 min 0 s");
    }
    
    
    
}