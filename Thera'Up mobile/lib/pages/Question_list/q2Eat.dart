import 'package:flutter/material.dart';
import 'package:thera_up/pages/Question_list/q3OverWhelmed.dart';

class Q2Eating extends StatefulWidget {
  final String? selectedSleepOption;

  const Q2Eating({super.key, required this.selectedSleepOption});

  @override
  State<Q2Eating> createState() => _NextQuestionWidgetState();
}

class _NextQuestionWidgetState extends State<Q2Eating> {
  String? _selectedEatOption;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar(),
      backgroundColor: Colors.white,
      body: ListView(
        children: [
          const SizedBox(height: 20),
          _eatQuestionCard(),
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

  Widget _eatQuestionCard() {
    return Column(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(10.0),
          child: Image.asset(
            'assets/images/eating.jpg', // Add your image in assets folder
            height: 200,
          ),
        ),
        const SizedBox(height: 20),
        const Text(
          'Any Changes in eating habits recently?',
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
                  _eatOption('Eating Less', '😋'),
                  _eatOption('Eating More', '😒'),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _eatOption('No Change', '😊'),
                  _eatOption('Lost Appetite', '😣'),
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
          _selectedEatOption = label;
        });
        // Navigate to the next screen and pass both selected options
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => Q3overwhelmed(
              selectedSleepOption: widget.selectedSleepOption,
              selectedEatOption: _selectedEatOption,
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

