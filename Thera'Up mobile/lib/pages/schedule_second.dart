import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class ScheduleSecond extends StatefulWidget {
  const ScheduleSecond({super.key});

  @override
  _ScheduleState createState() => _ScheduleState();
}

class _ScheduleState extends State<ScheduleSecond> {

  String? selectedSleepHours;
  String? selectedAppetite;
  String? selectedOverwhelmed;
  String? selectedIrritability;
  String? selectedFocus;
  String? selectedMemory;
  String? selectedSocialWithdrawal;
  String? selectedPhysicalActivity;

  final List<String> frequency = [
    'Always',
    'Often',
    'Sometimes',
    'Never',
  ];

  final List<String> sleepHours = [
    'Less than 4 hours',
    '4-6 hours',
    '6-8 hours',
    '8-10 hours',
    'More than 10 hours',
  ];

  final List<String> appetite = [
    'Eating less',
    'Eating more',
    'No Change',
    'Loss of appetite',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar(context),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(height: 30),
              Padding(
                padding: EdgeInsets.only(left: 20),
                child: Text(
                  'Physical Well-being',
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              SizedBox(height: 20),
              Text(
                "How many hours of sleep do you get each night?",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
              _sleepingDropdown(),
              SizedBox(height: 10),
              Text(
                "How often do you feel tired or fatigued?",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
              _appetiteDropDown(),
              SizedBox(height: 10),
              Text(
                "How often do you feel overwhelmed or unable to cope?",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
              _feelOverWhelmed(),
              SizedBox(height: 10),
              Text(
                "How often do you feel irritable or angry?",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
              _irritability(),
              SizedBox(height: 10),
              Text(
                "How often do you have trouble focusing or concentrating?",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
              _focus(),
              SizedBox(height: 10),
              Text(
                "How often do you have trouble remembering things?",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
              _memory(),
              SizedBox(height: 10),
              Text(
                "How often do you avoid social situations or withdraw from others?",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
              _socialWithdrawal(),
              SizedBox(height: 10),
              Text(
                "How often do you engage in physical activity?",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
              _physicalActivity(),
            ],
          ),
        ),
      ),
    );
  }

  AppBar appBar(BuildContext context) {
    return AppBar(
      centerTitle: true,
      title: Text(
        'Schedule Page',
        style: TextStyle(
          color: Colors.black,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
      ),
      backgroundColor: Colors.white,
      elevation: 0,
      leading: GestureDetector(
        onTap: () {
          Navigator.pop(context, 1);
        },
        child: Container(
          margin: EdgeInsets.all(10),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: Color(0xFFF7F8F8),
            borderRadius: BorderRadius.circular(10),
          ),
          child: SvgPicture.asset(
            'assets/icons/arrow-left.svg',
            height: 20,
            width: 20,
          ),
        ),
      ),
    );
  }

  DropdownButtonFormField _sleepingDropdown() {
    return DropdownButtonFormField<String>(
      decoration: InputDecoration(
        filled: true,
        fillColor: Color(0xff74B8FF).withOpacity(0.2),
        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 15),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide.none,
        ),
      ),
      hint: Text(
        "Select Number of Hours",
        style: TextStyle(color: Colors.grey),
      ),
      icon: SvgPicture.asset(
        'assets/icons/dropdown.svg',
        height: 20,
        width: 20,
      ),
      value: selectedSleepHours,
      items: sleepHours.map((String status) {
        return DropdownMenuItem<String>(
          value: status,
          child: Text(status),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          selectedSleepHours = value;
        });
      },
    );
  }

  DropdownButtonFormField _appetiteDropDown() {
    return DropdownButtonFormField<String>(
      decoration: InputDecoration(
        filled: true,
        fillColor: Color(0xff74B8FF).withOpacity(0.2),
        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 15),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide.none,
        ),
      ),
      hint: Text(
        "Changes in eating habits recently",
        style: TextStyle(color: Colors.grey),
      ),
      icon: SvgPicture.asset(
        'assets/icons/dropdown.svg',
        height: 20,
        width: 20,
      ),
      value: selectedAppetite,
      items: appetite.map((String status) {
        return DropdownMenuItem<String>(
          value: status,
          child: Text(status),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          selectedAppetite = value;
        });
      },
    );
  }

  DropdownButtonFormField _feelOverWhelmed() {
    return DropdownButtonFormField<String>(
      decoration: InputDecoration(
        filled: true,
        fillColor: Color(0xff74B8FF).withOpacity(0.2),
        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 15),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide.none,
        ),
      ),
      hint: Text(
        "Select Frequency",
        style: TextStyle(color: Colors.grey),
      ),
      icon: SvgPicture.asset(
        'assets/icons/dropdown.svg',
        height: 20,
        width: 20,
      ),
      value: selectedOverwhelmed,
      items: frequency.map((String status) {
        return DropdownMenuItem<String>(
          value: status,
          child: Text(status),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          selectedOverwhelmed = value;
        });
      },
    );
  }

  DropdownButtonFormField _irritability() {
    return DropdownButtonFormField<String>(
      decoration: InputDecoration(
        filled: true,
        fillColor: Color(0xff74B8FF).withOpacity(0.2),
        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 15),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide.none,
        ),
      ),
      hint: Text(
        "Select Frequency",
        style: TextStyle(color: Colors.grey),
      ),
      icon: SvgPicture.asset(
        'assets/icons/dropdown.svg',
        height: 20,
        width: 20,
      ),
      value: selectedOverwhelmed,
      items: frequency.map((String status) {
        return DropdownMenuItem<String>(
          value: status,
          child: Text(status),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          selectedOverwhelmed = value;
        });
      },
    );
  }

  DropdownButtonFormField _focus() {
    return DropdownButtonFormField<String>(
      decoration: InputDecoration(
        filled: true,
        fillColor: Color(0xff74B8FF).withOpacity(0.2),
        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 15),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide.none,
        ),
      ),
      hint: Text(
        "Select Frequency",
        style: TextStyle(color: Colors.grey),
      ),
      icon: SvgPicture.asset(
        'assets/icons/dropdown.svg',
        height: 20,
        width: 20,
      ),
      value: selectedOverwhelmed,
      items: frequency.map((String status) {
        return DropdownMenuItem<String>(
          value: status,
          child: Text(status),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          selectedOverwhelmed = value;
        });
      },
    );
  }

  DropdownButtonFormField _memory() {
    return DropdownButtonFormField<String>(
      decoration: InputDecoration(
        filled: true,
        fillColor: Color(0xff74B8FF).withOpacity(0.2),
        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 15),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide.none,
        ),
      ),
      hint: Text(
        "Select Frequency",
        style: TextStyle(color: Colors.grey),
      ),
      icon: SvgPicture.asset(
        'assets/icons/dropdown.svg',
        height: 20,
        width: 20,
      ),
      value: selectedOverwhelmed,
      items: frequency.map((String status) {
        return DropdownMenuItem<String>(
          value: status,
          child: Text(status),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          selectedOverwhelmed = value;
        });
      },
    );
  }

  DropdownButtonFormField _socialWithdrawal() {
    return DropdownButtonFormField<String>(
      decoration: InputDecoration(
        filled: true,
        fillColor: Color(0xff74B8FF).withOpacity(0.2),
        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 15),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide.none,
        ),
      ),
      hint: Text(
        "Select Frequency",
        style: TextStyle(color: Colors.grey),
      ),
      icon: SvgPicture.asset(
        'assets/icons/dropdown.svg',
        height: 20,
        width: 20,
      ),
      value: selectedOverwhelmed,
      items: frequency.map((String status) {
        return DropdownMenuItem<String>(
          value: status,
          child: Text(status),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          selectedOverwhelmed = value;
        });
      },
    );
  }

  DropdownButtonFormField _physicalActivity() {
    return DropdownButtonFormField<String>(
      decoration: InputDecoration(
        filled: true,
        fillColor: Color(0xff74B8FF).withOpacity(0.2),
        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 15),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide.none,
        ),
      ),
      hint: Text(
        "Select Frequency",
        style: TextStyle(color: Colors.grey),
      ),
      icon: SvgPicture.asset(
        'assets/icons/dropdown.svg',
        height: 20,
        width: 20,
      ),
      value: selectedOverwhelmed,
      items: frequency.map((String status) {
        return DropdownMenuItem<String>(
          value: status,
          child: Text(status),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          selectedOverwhelmed = value;
        });
      },
    );
  }

}