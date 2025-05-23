import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:thera_up/models/User.dart';


class UserApiService {
  static const String baseUrl = "https://theraupbackend.pixelcore.lk/api/v1/theraup/patients";

  Future<User?> loginUser(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"email": email, "password": password}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return User.fromJson(data["data"]);
      } else {
        throw Exception(jsonDecode(response.body)["message"] ?? "Login failed");
      }
    } catch (e) {
      throw Exception("Error: $e");
    }
  }

  Future<void> registerUser({
    required String fullName,
    required String email,
    required String password,
    required String gender,
    required String phone,
    required String dob,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/register'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "full_name": fullName,
          "email": email,
          "password": password,
          "gender": gender,
          "phone": phone,
          "dob": dob,
        }),
      );

      if (response.statusCode == 201) {
        return; // Success, no data to return
      } else {
        throw Exception(jsonDecode(response.body)["message"] ?? "Registration failed");
      }
    } catch (e) {
      throw Exception("Error: $e");
    }
  }

  // Fetch user profile
  Future<User> getUserProfile(int patientId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/$patientId'),
        headers: {"Content-Type": "application/json"},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return User.fromJson(data["data"]);
      } else {
        throw Exception(jsonDecode(response.body)["message"] ?? "Failed to fetch profile");
      }
    } catch (e) {
      throw Exception("Error: $e");
    }
  }

  // Change password
  Future<void> changePassword(int patientId, String oldPassword, String newPassword) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/password/$patientId'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "password": newPassword,
        }),
      );

      if (response.statusCode != 200) {
        throw Exception(jsonDecode(response.body)["message"] ?? "Failed to change password");
      }
    } catch (e) {
      throw Exception("Error: $e");
    }
  }

  // Delete account
  Future<void> deleteAccount(int patientId) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/$patientId'),
        headers: {"Content-Type": "application/json"},
      );

      if (response.statusCode != 200) {
        throw Exception(jsonDecode(response.body)["message"] ?? "Failed to delete account");
      }
    } catch (e) {
      throw Exception("Error: $e");
    }
  }
}
