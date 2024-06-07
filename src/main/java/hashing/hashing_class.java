package hashing;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;



public class hashing_class {
	private static final String FIXED_SALT = "myFixedSalt";

    public static String hashPassword(String password) {
        String passwordWithSalt = password + FIXED_SALT;

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = digest.digest(passwordWithSalt.getBytes(StandardCharsets.UTF_8));

            return bytesToHex(hashedBytes);
        } catch (NoSuchAlgorithmException e) {
            // Gérer l'exception appropriée
            return null;
        }
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
