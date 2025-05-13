// physical_api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class PhysicalApiService {
  static const String baseUrl =
      "https://theraupbackend.pixelcore.lk/api/v1/theraup/patients";

  Future<void> savePhysicalInfo(Map<String, dynamic> physicalData) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/physical-info'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(physicalData),
      );

      if (response.statusCode != 201) {
        throw Exception(
            jsonDecode(response.body)["message"] ?? "Failed to save physical info");
      }
    } catch (e) {
      throw Exception("Error saving physical info: $e");
    }
  }
}