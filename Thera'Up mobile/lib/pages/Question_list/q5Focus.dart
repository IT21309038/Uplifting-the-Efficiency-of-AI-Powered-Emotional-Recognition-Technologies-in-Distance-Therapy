import 'package:flutter/material.dart';
import 'package:thera_up/pages/Question_list/q6Memory.dart';

class Q5focus extends StatefulWidget {
  final String? selectedSleepOption;
  final String? selectedEatOption;
  final String? selectedOverwhelmedOption;
  final String? selectedAngryOption;

  const Q5focus({super.key, this.selectedSleepOption, this.selectedEatOption, this.selectedOverwhelmedOption, this.selectedAngryOption});

  @override
  State<Q5focus> createState() => _Q5FocusState();
}

class _Q5FocusState extends State<Q5focus> {
  String? _selectedFocusOption;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar(),
      backgroundColor: Colors.white,
      body: ListView(
        children: [
          const SizedBox(height: 20),
          _FocusCard(),
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

  Widget _FocusCard() {
    return Column(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(10.0),
          child: Image.asset(
            'assets/images/focus.jpg', // Add your image in assets folder
            height: 200,
          ),
        ),
        const SizedBox(height: 20),
        const Text(
          'How often do you have trouble focusing or concentrating?',
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
                  _eatOption('Always', '😬'),
                  _eatOption('Often', '🙄'),
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
          _selectedFocusOption = label;
        });
        // Navigate to the next screen and pass both selected options
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => Q6Memory(
              selectedSleepOption: widget.selectedSleepOption,
              selectedEatOption: widget.selectedEatOption,
              selectedOverwhelmedOption: widget.selectedOverwhelmedOption,
              selectedAngryOption: widget.selectedAngryOption,
              selectedFocusOption: _selectedFocusOption,
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