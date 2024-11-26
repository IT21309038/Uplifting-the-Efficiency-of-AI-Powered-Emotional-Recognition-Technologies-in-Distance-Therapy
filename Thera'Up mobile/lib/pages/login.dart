import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:thera_up/pages/base_ui.dart';
import 'package:thera_up/pages/register.dart';

//shortcut for creating a stateless widget "stl"
class Login extends StatelessWidget {
  const Login({super.key});

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

  Column _topSection(){
    return Column(
      children: [
        const SizedBox(height: 100),
        const Text(
          'Login Here',
          style: TextStyle(fontSize: 35, fontWeight: FontWeight.bold, color: Color(0xff74B8FF)),
        ),
        const SizedBox(height: 30),
        const Text(
          'Welcome back!',
          style: TextStyle(fontSize: 20, color: Colors.black, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  Column _fieldSection(){
    return Column(
      children: [
        const Text(
          ' Please login to your account',
          style: TextStyle(fontSize: 16, color: Colors.black),
        ),
        const SizedBox(height: 50),
        Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Container(
                decoration: BoxDecoration(
                  boxShadow: [
                    BoxShadow(
                      color: Color(0xff74B8FF).withOpacity(0.4),
                      spreadRadius: 0,
                      blurRadius: 70,
                    ),
                  ],
                ),
                child: TextField(
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: Color(0xff74B8FF).withOpacity(0.2),
                    contentPadding: EdgeInsets.all(15),
                    hintText: 'Email',
                    hintStyle: TextStyle(
                      color: Colors.black.withOpacity(0.5),
                      fontSize: 16,
                    ),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide(
                          color: Color(0xff74B8FF),
                        )
                    ),
                    prefixIcon: Padding(
                      padding: EdgeInsets.all(15),
                      child: SvgPicture.asset('assets/icons/email.svg'),

                    ),
                  ),
                ),

              ),
              const SizedBox(height: 30),
              Container(
                decoration: BoxDecoration(
                  boxShadow: [
                    BoxShadow(
                      color: Color(0xff74B8FF).withOpacity(0.4),
                      spreadRadius: 0,
                      blurRadius: 70,
                    ),
                  ],
                ),
                child: TextField(
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: Color(0xff74B8FF).withOpacity(0.2),
                    contentPadding: EdgeInsets.all(15),
                    hintText: 'Password',
                    hintStyle: TextStyle(
                      color: Colors.black.withOpacity(0.5),
                      fontSize: 16,
                    ),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide(
                          color: Color(0xff74B8FF),
                        )
                    ),
                    prefixIcon: Padding(
                      padding: EdgeInsets.all(15),
                      child: SvgPicture.asset('assets/icons/key.svg'),

                    ),
                  ),
                ),

              ),
              const SizedBox(height: 50),
            ],
          ),
        ),
      ],
    );
  }

  Column _bottomSection(BuildContext context){
    return Column(
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child:ElevatedButton(
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (context) => const BaseUi()));
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Color(0xFF9DCEFF), // Button color
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8), // Rounded corners
              ),
              padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
            ),
            child: Text(
              "Sign in",
              style: TextStyle(
                color: Colors.white, // Text color
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(height: 50),
        const Text("Or" , style: TextStyle(fontSize: 16, color: Colors.black),),
        const SizedBox(height: 20),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Don\'t have an account?'),
            TextButton(
              onPressed: () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => const Register()));
              },
              child: const Text('Register',
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
