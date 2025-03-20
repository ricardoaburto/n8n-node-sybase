import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.ResultSetMetaData;
import org.json.JSONArray;
import org.json.JSONObject;

public class SybaseQuery {
    public static void main(String[] args) {
        if (args.length < 5) {
            System.err.println("Usage: java SybaseQuery <host> <port> <database> <username> <password> <query>");
            System.exit(1);
        }

        String host = args[0];
        String port = args[1];
        String database = args[2];
        String username = args[3];
        String password = args[4];
        String query = args[5];

        String dbUrl = "jdbc:jtds:sybase://" + host + ":" + port + "/" + database;

        try {
            Class.forName("net.sourceforge.jtds.jdbc.Driver");
            Connection connection = DriverManager.getConnection(dbUrl, username, password);
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(query);

            // Convertir resultados a JSON
            JSONArray results = new JSONArray();
            ResultSetMetaData metaData = resultSet.getMetaData();
            int columnCount = metaData.getColumnCount();

            while (resultSet.next()) {
                JSONObject row = new JSONObject();
                for (int i = 1; i <= columnCount; i++) {
                    String columnName = metaData.getColumnName(i);
                    row.put(columnName, resultSet.getString(i));
                }
                results.put(row);
            }

            // Imprimir resultados como JSON
            System.out.println(results.toString());

            resultSet.close();
            statement.close();
            connection.close();
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            System.exit(1);
        }
    }
}