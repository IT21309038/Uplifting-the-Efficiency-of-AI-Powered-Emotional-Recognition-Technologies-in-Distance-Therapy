import 'package:shared_preferences/shared_preferences.dart';

class SessionService {
  static Future<int?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt('userId');
  }
}