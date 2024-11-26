import 'package:flutter/material.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar:  appBar(),
      backgroundColor: Colors.white,
      body: Column(
        children: [
          const SizedBox(height: 20),
          const Text(
            'Welcome to TheraUp',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xff74B8FF)),
          ),

        ],
      ),
    );
  }

  AppBar appBar(){
    return AppBar(
      centerTitle: true,
      title: Text('Home Page',
        style: TextStyle(
          color: Colors.black,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),),
      automaticallyImplyLeading: false,
      backgroundColor: Colors.white,
      elevation: 0,
    );
  }
}
