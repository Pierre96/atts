// package com.atts.tools.msystem.application.parsers;

// import com.atts.tools.msystem.application.parsers.consumptions.XlsxConsumptionsParser;
// import com.atts.tools.msystem.common.exceptions.types.IlegalRequestException;
// import java.io.FileInputStream;
// import java.io.IOException;
// import java.sql.Date;
// import java.util.ArrayList;
// import java.util.List;
// import org.junit.jupiter.api.Assertions;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;


// @SpringBootTest
// public class StandardXlsxParserTest {

//     @Autowired
//     private XlsxConsumptionsParser parser;

//     @Test
//     public void extractRowsTest() throws IOException, IlegalRequestException {
//         FileInputStream fileInputStream = new FileInputStream("src/test/resources/goodInputExtractor.xlsx");
//         List<List<Object>> results = parser.extractRows(fileInputStream);

//       List<Object> row = new ArrayList<>(
//           List.of("OIPF2022050971", "TELEPHONIE IP", "Abonnement périodique", "OIP-00006628", "FPC1512983",
//               "SIP Trunk Touch", "OC414543", "Appel(s) simu(s) SIP - Illimité fixes,mobiles et inter NPV", 12.00,
//               2.40,
//               14.40, "Assujetti", 20.00, Date.valueOf("2022-06-01"), Date.valueOf("2022-06-30")));
//         row.add(null);
//         row.add(null);
//         row.add(null);
//         row.add(null);
//         row.addAll(List.of("Siège Social 65 AV STROH AVESNES-SUR-HELPE", "music center", "0033,,,"));

//         List<List<Object>> expectedResults = new ArrayList<>();
//         expectedResults.add(row);

//         Assertions.assertEquals(expectedResults, results);
//     }
// }
