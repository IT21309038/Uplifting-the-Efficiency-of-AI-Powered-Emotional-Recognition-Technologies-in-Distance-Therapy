import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:thera_up/models/User.dart';
import 'package:thera_up/pages/base_ui.dart';
import 'package:thera_up/pages/register.dart';
import 'package:thera_up/services/UserApiService.dart';
import 'package:shared_preferences/shared_preferences.dart';

//shortcut for creating a stateless widget "stl"
class Login extends StatefulWidget  {
  const Login({super.key});

  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final UserApiService _apiService = UserApiService();
  bool _isLoading = false;

  Future<void> _login() async {
    setState(() => _isLoading = true);

    String email = _emailController.text.trim();
    String password = _passwordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      _showError("Please enter email and password.");
      setState(() => _isLoading = false);
      return;
    }

    try {
      User? user = await _apiService.loginUser(email, password);
      if (user != null) {
        await _saveUserSession(user);
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const BaseUi()),
        );
      }
    } catch (e) {
      _showError(e.toString());
    }

    setState(() => _isLoading = false);
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message, style: const TextStyle(color: Colors.white)), backgroundColor: Colors.red),
    );
  }

  Future<void> _saveUserSession(User user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('userId', user.id);
    await prefs.setString('fullName', user.fullName);
    await prefs.setString('email', user.email);
    await prefs.setString('role', user.role);
    await prefs.setString('dob', user.dob);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView( // FIXED BOTTOM OVERFLOW
          child: Column(
            children: [
              _topSection(),
              _fieldSection(),
              _bottomSection(context),
            ],
          ),
        ),
      ),
    );
  }

  Column _topSection() {
    return Column(
      children: const [
        SizedBox(height: 100),
        Text('Login Here', style: TextStyle(fontSize: 35, fontWeight: FontWeight.bold, color: Color(0xff74B8FF))),
        SizedBox(height: 30),
        Text('Welcome back!', style: TextStyle(fontSize: 20, color: Colors.black, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Column _fieldSection() {
    return Column(
      children: [
        const Text('Please login to your account', style: TextStyle(fontSize: 16, color: Colors.black)),
        const SizedBox(height: 50),
        Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              _inputField("Email", _emailController, 'assets/icons/email.svg'),
              const SizedBox(height: 30),
              _inputField("Password", _passwordController, 'assets/icons/key.svg', isPassword: true),
              const SizedBox(height: 50),
            ],
          ),
        ),
      ],
    );
  }

  Widget _inputField(String hint, TextEditingController controller, String icon, {bool isPassword = false}) {
    return TextField(
      controller: controller,
      obscureText: isPassword,
      decoration: InputDecoration(
        filled: true,
        fillColor: const Color(0xff74B8FF).withOpacity(0.2),
        contentPadding: const EdgeInsets.all(15),
        hintText: hint,
        hintStyle: TextStyle(color: Colors.black.withOpacity(0.5), fontSize: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: Color(0xff74B8FF)),
        ),
        prefixIcon: Padding(
          padding: const EdgeInsets.all(15),
          child: SvgPicture.asset(icon),
        ),
      ),
    );
  }

  Column _bottomSection(BuildContext context) {
    return Column(
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: ElevatedButton(
            onPressed: _isLoading ? null : _login,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF9DCEFF),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
            ),
            child: _isLoading
                ? const CircularProgressIndicator(color: Colors.white)
                : const Text("Sign in", style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
          ),
        ),
        const SizedBox(height: 50),
        const Text("Or", style: TextStyle(fontSize: 16, color: Colors.black)),
        const SizedBox(height: 20),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text("Don't have an account?"),
            TextButton(
              onPressed: () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => const Register()));
              },
              child: const Text("Register", style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xff74B8FF))),
            ),
          ],
        ),
      ],
    );
  }
}
