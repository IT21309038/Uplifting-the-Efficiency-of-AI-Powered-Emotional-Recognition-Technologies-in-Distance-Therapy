import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:intl/intl.dart';
import 'package:thera_up/models/User.dart';
import 'package:thera_up/pages/login.dart';
import 'package:thera_up/services/UserApiService.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Register extends StatefulWidget {
  const Register({Key? key}) : super(key: key);

  @override
  _RegisterState createState() => _RegisterState();
}

class _RegisterState extends State<Register> {
  final TextEditingController _fullNameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _dobController = TextEditingController();
  String? _selectedGender;
  final UserApiService _apiService = UserApiService();
  bool _isLoading = false;

  final List<String> _genderOptions = ['Male', 'Female', 'Other'];

  Future<void> _register() async {
    setState(() => _isLoading = true);

    String fullName = _fullNameController.text.trim();
    String email = _emailController.text.trim();
    String password = _passwordController.text.trim();
    String phone = _phoneController.text.trim();
    String dob = _dobController.text.trim();
    String gender = _selectedGender ?? '';

    if (fullName.isEmpty ||
        email.isEmpty ||
        password.isEmpty ||
        gender.isEmpty ||
        phone.isEmpty ||
        dob.isEmpty) {
      _showError("Please fill in all fields.");
      setState(() => _isLoading = false);
      return;
    }

    try {
      await _apiService.registerUser(
        fullName: fullName,
        email: email,
        password: password,
        gender: gender,
        phone: phone,
        dob: dob,
      );
      _showSuccess("Registration successful! Please log in.");
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const Login()),
      );
    } catch (e) {
      _showError(e.toString());
    }

    setState(() => _isLoading = false);
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message, style: const TextStyle(color: Colors.white)),
        backgroundColor: Colors.red,
      ),
    );
  }

  void _showSuccess(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message, style: const TextStyle(color: Colors.white)),
        backgroundColor: Colors.green,
      ),
    );
  }

  Future<void> _selectDate() async {
    DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (pickedDate != null) {
      setState(() {
        _dobController.text = DateFormat('yyyy-MM-dd').format(pickedDate);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
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
        Text(
          'Register Here',
          style: TextStyle(
            fontSize: 35,
            fontWeight: FontWeight.bold,
            color: Color(0xff74B8FF),
          ),
        ),
        SizedBox(height: 30),
        Text(
          'Create your account',
          style: TextStyle(
            fontSize: 20,
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Column _fieldSection() {
    return Column(
      children: [
        const SizedBox(height: 20),
        const Text(
          'Fill in your details to register',
          style: TextStyle(fontSize: 16, color: Colors.black),
        ),
        const SizedBox(height: 50),
        Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              _buildTextField(
                hintText: 'Full Name',
                svgIconPath: 'assets/icons/user.svg',
                controller: _fullNameController,
              ),
              const SizedBox(height: 30),
              _buildTextField(
                hintText: 'Email',
                svgIconPath: 'assets/icons/email.svg',
                controller: _emailController,
              ),
              const SizedBox(height: 30),
              _buildTextField(
                hintText: 'Password',
                svgIconPath: 'assets/icons/key.svg',
                controller: _passwordController,
                obscureText: true,
              ),
              const SizedBox(height: 30),
              _buildGenderDropdown(),
              const SizedBox(height: 30),
              _buildTextField(
                hintText: 'Phone',
                svgIconPath: 'assets/icons/phone.svg',
                controller: _phoneController,
              ),
              const SizedBox(height: 30),
              _buildDatePickerField(),
              const SizedBox(height: 50),
            ],
          ),
        ),
      ],
    );
  }

  Container _buildTextField({
    required String hintText,
    required String svgIconPath,
    bool obscureText = false,
    required TextEditingController controller,
    bool readOnly = false,
    VoidCallback? onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        boxShadow: [
          BoxShadow(
            color: const Color(0xff74B8FF).withOpacity(0.4),
            spreadRadius: 0,
            blurRadius: 70,
          ),
        ],
      ),
      child: TextField(
        controller: controller,
        obscureText: obscureText,
        readOnly: readOnly,
        onTap: onTap,
        decoration: InputDecoration(
          filled: true,
          fillColor: const Color(0xff74B8FF).withOpacity(0.2),
          contentPadding: const EdgeInsets.all(15),
          hintText: hintText,
          hintStyle: TextStyle(
            color: Colors.black.withOpacity(0.5),
            fontSize: 16,
          ),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(
              color: Color(0xff74B8FF),
            ),
          ),
          prefixIcon: Padding(
            padding: const EdgeInsets.all(15),
            child: SvgPicture.asset(svgIconPath),
          ),
        ),
      ),
    );
  }

  Container _buildGenderDropdown() {
    return Container(
      decoration: BoxDecoration(
        boxShadow: [
          BoxShadow(
            color: const Color(0xff74B8FF).withOpacity(0.4),
            spreadRadius: 0,
            blurRadius: 70,
          ),
        ],
      ),
      child: DropdownButtonFormField<String>(
        value: _selectedGender,
        hint: Text(
          'Gender',
          style: TextStyle(
            color: Colors.black.withOpacity(0.5),
            fontSize: 16,
          ),
        ),
        decoration: InputDecoration(
          filled: true,
          fillColor: const Color(0xff74B8FF).withOpacity(0.2),
          contentPadding: const EdgeInsets.all(15),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(
              color: Color(0xff74B8FF),
            ),
          ),
          prefixIcon: Padding(
            padding: const EdgeInsets.all(15),
            child: SvgPicture.asset(
              'assets/icons/gender.svg',
              height: 24, // Match other icons
              width: 24,  // Match other icons
            ),
          ),
        ),
        items: _genderOptions.map((String gender) {
          return DropdownMenuItem<String>(
            value: gender,
            child: Text(gender),
          );
        }).toList(),
        onChanged: (String? newValue) {
          setState(() {
            _selectedGender = newValue;
          });
        },
      ),
    );
  }

  Container _buildDatePickerField() {
    return _buildTextField(
      hintText: 'Date of Birth (YYYY-MM-DD)',
      svgIconPath: 'assets/icons/calendar.svg',
      controller: _dobController,
      readOnly: true,
      onTap: _selectDate,
    );
  }

  Column _bottomSection(BuildContext context) {
    return Column(
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: ElevatedButton(
            onPressed: _isLoading ? null : _register,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF9DCEFF),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
            ),
            child: _isLoading
                ? const CircularProgressIndicator(color: Colors.white)
                : const Text(
              "Register",
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(height: 50),
        const Text(
          "Or",
          style: TextStyle(fontSize: 16, color: Colors.black),
        ),
        const SizedBox(height: 20),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Already have an account?'),
            TextButton(
              onPressed: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const Login()),
                );
              },
              child: const Text(
                'Login',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Color(0xff74B8FF),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}