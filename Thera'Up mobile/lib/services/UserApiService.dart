import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:thera_up/models/User.dart';


class UserApiService {
  static const String baseUrl = "http://20.2.82.154:8085/api/v1/theraup/patients/login";

  Future<User?> loginUser(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse(baseUrl),
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
}
