import 'package:flutter/material.dart';

class Profile extends StatelessWidget {
  const Profile({Key? key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar:  appBar(),
      backgroundColor: Colors.white,
    );
  }

  AppBar appBar(){
    return AppBar(
      centerTitle: true,
      title: Text('Profile Page',
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