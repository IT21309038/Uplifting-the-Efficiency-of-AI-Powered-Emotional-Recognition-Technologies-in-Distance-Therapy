import 'dart:convert';
import 'package:http/http.dart' as http;

class GeneralInfoApiService {
  static const String baseUrl = "https://theraupbackend.pixelcore.lk/api/v1/theraup/patients/save-general-info";

  Future<void> saveGeneralInfo({
    required String patientId,
    required String empStatus,
    required String civilStatus,
    required String livingStatus,
    required String income,
    required String socialLife,
  }) async {
    try {
      // Prepare the payload
      final Map<String, dynamic> payload = {
        "patientId": patientId,
        "empStatus": empStatus,
        "civilStatus": civilStatus,
        "livingStatus": livingStatus,
        "income": income,
        "socialLife": socialLife,
      };

      // Send the POST request
      final response = await http.post(
        Uri.parse(baseUrl),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(payload),
      );

      // Check the response status code
      if (response.statusCode == 201) {
        // Success
        return;
      } else {
        // Handle errors
        throw Exception(jsonDecode(response.body)["message"] ?? "Failed to save general info");
      }
    } catch (e) {
      throw Exception("Error: $e");
    }
  }
}