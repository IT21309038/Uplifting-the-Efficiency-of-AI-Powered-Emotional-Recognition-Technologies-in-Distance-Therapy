import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class Register extends StatelessWidget {
  const Register({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          _topSection(),
          _fieldSection(),
          _bottomSection(context),
        ],
      ),
    );
  }

  Column _topSection() {
    return Column(
      children: [
        const SizedBox(height: 100),
        const Text(
          'Register Here',
          style: TextStyle(
            fontSize: 35,
            fontWeight: FontWeight.bold,
            color: Color(0xff74B8FF),
          ),
        ),
        const SizedBox(height: 30),
        const Text(
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
                hintText: 'Username',
                svgIconPath: 'assets/icons/user.svg',
              ),
              const SizedBox(height: 30),
              _buildTextField(
                hintText: 'Email',
                svgIconPath: 'assets/icons/email.svg',
              ),
              const SizedBox(height: 30),
              _buildTextField(
                hintText: 'Password',
                svgIconPath: 'assets/icons/key.svg',
                obscureText: true,
              ),
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
        obscureText: obscureText,
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

  Column _bottomSection(BuildContext context) {
    return Column(
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: ElevatedButton(
            onPressed: () {
              // Logic for registering the user goes here
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF9DCEFF),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
            ),
            child: const Text(
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
                Navigator.pop(context);
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
