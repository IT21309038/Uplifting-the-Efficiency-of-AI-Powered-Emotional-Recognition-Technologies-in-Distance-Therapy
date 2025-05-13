import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:thera_up/pages/appointment_suggestions.dart';

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
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: EdgeInsets.only(left: 20),
                child: Text(
                  'Physical Well-being',
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              SizedBox(height: 30),
              Text(
                "How many hours of sleep do you get each night?",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
              _sleepingDropdown(),
              SizedBox(height: 20),
              Text(
                "How often do you feel tired or fatigued?",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
              _appetiteDropDown(),
              SizedBox(height: 20),
              Text(
                "How often do you feel overwhelmed or unable to cope?",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
              _feelOverWhelmed(),
              SizedBox(height: 20),
              Text(
                "How often do you feel irritable or angry?",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
              _irritability(),
              SizedBox(height: 20),
              Text(
                "How often do you have trouble focusing or concentrating?",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
              _focus(),
              SizedBox(height: 20),
              Text(
                "How often do you have trouble remembering things?",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
              _memory(),
              SizedBox(height: 20),
              Text(
                "How often do you avoid social situations or withdraw from others?",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
              _socialWithdrawal(),
              SizedBox(height: 20),
              Text(
                "How often do you engage in physical activity?",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
              _physicalActivity(),
              SizedBox(height: 20),
              Align(
                alignment: Alignment.centerRight,
                child: GestureDetector(
                  // onTap: () {
                  //   Navigator.push(
                  //     context,
                  //     MaterialPageRoute(builder: (context) => AppointmentSuggestions()),
                  //   );
                  // },
                  // onTap: () {
                  //   if (selectedAppetite != null &&
                  //       selectedSleepHours != null &&
                  //       selectedIrritability != null &&
                  //       selectedMemory != null &&
                  //       selectedPhysicalActivity != null &&
                  //       selectedIrritability != null &&
                  //       selectedSocialWithdrawal != null &&
                  //       selectedFocus != null
                  //   ) {
                  //     Navigator.push(
                  //       context,
                  //       MaterialPageRoute(builder: (context) => ScheduleSecond()),
                  //     );
                  //   } else {
                  //     ScaffoldMessenger.of(context).showSnackBar(
                  //       SnackBar(
                  //         content: Text('Please fill all the fields'),
                  //       ),
                  //     );
                  //   }
                  // },
                  child: Container(
                    height: 45,
                    width: 100,
                    child: Center(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Next',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          SizedBox(width: 8), // Space between text and icon
                          SvgPicture.asset(
                            'assets/icons/arrow-right.svg', // Path to your arrow-right icon
                            height: 20,
                            width: 20,
                            color: Colors.white,
                          ),
                        ],
                      ),
                    ),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(30),
                      gradient: LinearGradient(
                        colors: [
                          Color(0xff9DCEFF),
                          Color(0xff92A3FD),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
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
      value: selectedIrritability,
      items: frequency.map((String status) {
        return DropdownMenuItem<String>(
          value: status,
          child: Text(status),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          selectedIrritability = value;
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
      value: selectedFocus,
      items: frequency.map((String status) {
        return DropdownMenuItem<String>(
          value: status,
          child: Text(status),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          selectedFocus = value;
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
      value: selectedMemory,
      items: frequency.map((String status) {
        return DropdownMenuItem<String>(
          value: status,
          child: Text(status),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          selectedMemory = value;
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
      value: selectedSocialWithdrawal,
      items: frequency.map((String status) {
        return DropdownMenuItem<String>(
          value: status,
          child: Text(status),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          selectedSocialWithdrawal = value;
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
      value: selectedPhysicalActivity,
      items: frequency.map((String status) {
        return DropdownMenuItem<String>(
          value: status,
          child: Text(status),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          selectedPhysicalActivity = value;
        });
      },
    );
  }

}