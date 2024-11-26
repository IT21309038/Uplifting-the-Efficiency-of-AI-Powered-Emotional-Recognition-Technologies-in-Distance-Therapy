import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class Therapy extends StatelessWidget {
  const Therapy({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar:  appBar(),
      backgroundColor: Colors.white,
      body: ListView(
        children: [
          const SizedBox(height: 20),
          _scheduleNow(),
          const SizedBox(height: 30),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: EdgeInsets.only(left: 20),
                child: Text(
                  'Upcoming Therapies',
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 20,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  AppBar appBar(){
    return AppBar(
      centerTitle: true,
      title: Text('Therapy Page',
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

  Column _scheduleNow() {
    return Column(
      children: [
        Container(
          height: 100,
          margin: EdgeInsets.only(left: 20, right: 20),
          decoration: BoxDecoration(
            color: Color(0xff9DCEFF).withOpacity(0.5),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Padding(
            padding: EdgeInsets.all(20.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Schedule a therapy now',
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 20,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Container(
                  height: 50,
                  width: 50,
                  child: SvgPicture.asset('assets/icons/arrow-right.svg'),
                )
              ],
            ),
          ),
        ),
      ],
    );
  }
}
