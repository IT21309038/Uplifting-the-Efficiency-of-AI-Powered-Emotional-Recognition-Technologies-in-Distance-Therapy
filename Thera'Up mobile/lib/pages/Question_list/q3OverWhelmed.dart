import 'package:flutter/material.dart';
import 'package:thera_up/pages/Question_list/q4Angry.dart';

class Q3overwhelmed extends StatefulWidget {
  final String? selectedSleepOption;
  final String? selectedEatOption;

  const Q3overwhelmed({super.key, this.selectedSleepOption, this.selectedEatOption});

  @override
  State<Q3overwhelmed> createState() => _Q3overwhelmedState();
}

class _Q3overwhelmedState extends State<Q3overwhelmed> {
  String? _selectedOverwhelmedOption;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar(),
      backgroundColor: Colors.white,
      body: ListView(
        children: [
          const SizedBox(height: 20),
          _OverWhelmedCard(),
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

  Widget _OverWhelmedCard() {
    return Column(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(10.0),
          child: Image.asset(
            'assets/images/overwhe.jpg', // Add your image in assets folder
            height: 230,
          ),
        ),
        const SizedBox(height: 20),
        const Text(
          'How often do you feel overwhelmed or unable to cope?',
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
                  _eatOption('Always', '😞'),
                  _eatOption('Often', '😟'),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _eatOption('Sometimes', '😐'),
                  _eatOption('Never', '😊'),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _eatOption(String label, String emoji) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedOverwhelmedOption = label;
        });
        // Navigate to the next screen and pass both selected options
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => Q4Angry(
              selectedSleepOption: widget.selectedSleepOption,
              selectedEatOption: widget.selectedEatOption,
              selectedOverwhelmedOption: _selectedOverwhelmedOption,
            ),
          ),
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