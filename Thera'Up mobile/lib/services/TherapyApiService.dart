import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:thera_up/models/PastTModel.dart';

import 'package:thera_up/models/UpCommingTModel.dart';

class TherapyApiService {
  static const String baseUrl = "https://theraupbackend.pixelcore.lk/api/v1/theraup/schedule/get-all-schedule-by-patient";

  Future<List<UpCommingTModel>> getUpcomingTherapies(int patientId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/$patientId?status=pending'),
        headers: {"Content-Type": "application/json"},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        // Extract the list from the 'data' key
        final therapiesList = data['data'] as List;
        return therapiesList.map((therapy) => UpCommingTModel.fromJson(therapy)).toList();
      } else {
        throw Exception("Failed to fetch upcoming therapies");
      }
    } catch (e) {
      print('Error fetching upcoming therapies: $e');
      throw Exception("Error: $e");
    }
  }

  Future<List<PastTModel>> getPastTherapies(int patientId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/$patientId?status=completed'),
        headers: {"Content-Type": "application/json"},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        // Extract the list from the 'data' key
        final therapiesList = data['data'] as List;
        return therapiesList.map((therapy) => PastTModel.fromJson(therapy)).toList();
      } else {
        throw Exception("Failed to fetch past therapies");
      }
    } catch (e) {
      print('Error fetching past therapies: $e');
      throw Exception("Error: $e");
    }
  }
}