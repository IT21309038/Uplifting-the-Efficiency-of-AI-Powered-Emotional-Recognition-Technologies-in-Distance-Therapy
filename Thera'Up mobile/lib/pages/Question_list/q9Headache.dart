import 'package:flutter/material.dart';
import 'package:thera_up/pages/Question_list/q10Negative.dart';

class Q9Headache extends StatefulWidget {
  final String? selectedSleepOption;
  final String? selectedEatOption;
  final String? selectedOverwhelmedOption;
  final String? selectedAngryOption;
  final String? selectedFocusOption;
  final String? selectedMemoryOption;
  final String? selectedSocialOption;
  final String? selectedPhysicalOption;

  const Q9Headache({super.key, this.selectedSleepOption, this.selectedEatOption, this.selectedOverwhelmedOption, this.selectedAngryOption, this.selectedFocusOption, this.selectedMemoryOption, this.selectedSocialOption, this.selectedPhysicalOption});

  @override
  State<Q9Headache> createState() => _Q9HeadacheState();
}

class _Q9HeadacheState extends State<Q9Headache> {
  String? _selectedHeadacheOption;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar(),
      backgroundColor: Colors.white,
      body: ListView(
        children: [
          const SizedBox(height: 20),
          _PhysicalCard(),
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

  Widget _PhysicalCard() {
    return Column(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(10.0),
          child: Image.asset(
            'assets/images/headache.jpg', // Add your image in assets folder
            height: 200,
          ),
        ),
        const SizedBox(height: 20),
        const Text(
          'How often do you experience headaches, muscle tension, or other physical symptoms of stress?',
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
                  _eatOption('Always', '😰'),
                  _eatOption('Often', '🤕'),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _eatOption('Sometimes', '😔'),
                  _eatOption('Never', '😄'),
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
          _selectedHeadacheOption = label;
        });
        // Navigate to the next screen and pass both selected options
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => Q10Negative(
                selectedSleepOption: widget.selectedSleepOption,
                selectedEatOption: widget.selectedEatOption,
                selectedOverwhelmedOption: widget.selectedOverwhelmedOption,
                selectedAngryOption: widget.selectedAngryOption,
                selectedFocusOption: widget.selectedFocusOption,
                selectedMemoryOption: widget.selectedMemoryOption,
                selectedSocialOption: widget.selectedSocialOption,
                selectedPhysicalOption: widget.selectedPhysicalOption,
                selectedHeadacheOption: _selectedHeadacheOption,


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