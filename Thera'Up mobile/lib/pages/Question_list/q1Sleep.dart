import 'package:flutter/material.dart';
import 'package:thera_up/pages/Question_list/q2Eat.dart';

class ScheduleSecondNew extends StatefulWidget {
  const ScheduleSecondNew({super.key});

  @override
  State<ScheduleSecondNew> createState() => _ScheduleSecondNewState();
}

class _ScheduleSecondNewState extends State<ScheduleSecondNew> {
  String? _selectedSleepOption;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar(),
      backgroundColor: Colors.white,
      body: ListView(
        children: [
          const SizedBox(height: 20),
          _sleepQuestionCard(),
        ],
      ),
    );
  }

  AppBar appBar() {
    return AppBar(
      centerTitle: true,
      title: const Text(
        'Physical Well Being',
        style: TextStyle(
          color: Colors.black,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
      ),
      automaticallyImplyLeading: false,
      backgroundColor: Colors.white,
      elevation: 0,
    );
  }

  Widget _sleepQuestionCard() {
    return Column(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(10.0),
          child: Image.asset(
            'assets/images/night.jpg', // Add your image in assets folder
            height: 200,
          ),
        ),
        const SizedBox(height: 20),
        const Text(
          'How many hours of sleep do you get each night?',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.w500),
        ),
        const SizedBox(height: 40),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _sleepOption('less than 4', '😞'),
                  _sleepOption('4-6 hours', '🥱'),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _sleepOption('6-8 hours', '😊'),
                  _sleepOption('more than 8', '😴'),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _sleepOption(String label, String emoji) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedSleepOption = label;
        });
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => Q2Eating(selectedSleepOption: _selectedSleepOption)),
        );
      },
      child: Container(
        height: 170,
        width: 170,
        decoration: BoxDecoration(
          color: Colors.grey.shade300,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              label,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w500),
            ),
            Text(
              emoji,
              style: const TextStyle(fontSize: 30),
            ),
          ],
        ),
      ),
    );
  }
}

