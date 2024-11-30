import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:thera_up/pages/schedule_second.dart';

class Schedule extends StatefulWidget {
  const Schedule({super.key});

  @override
  _ScheduleState createState() => _ScheduleState();
}

class _ScheduleState extends State<Schedule> {
  String? selectedStatus;
  String? selectedCivilStatus;
  String? selectedLivingSituation;
  String? selectedFinancialStatus;
  String? selectedHealthStatus;
  String? selectedSocialSupport;
  String? selectedReligiousOrCulturalFactors;

  final TextEditingController fullNameController = TextEditingController();

  final List<String> status = [
    'Employed',
    'Unemployed',
    'Student',
    'Retired'
  ];

  final List<String> civilStatus = [
    'Married',
    'Unmarried',
    'Divorced',
    'Widowed',
    'In a Relationship',
    'Single'
  ];

  final List<String> livingSituation = [
    'Living Alone',
    'Living with Family',
    'Living with Roommates',
    'Living with Partner',
    'In a Shared Apartment',
    'Homeless',
    'In Temporary Housing',
  ];

  final List<String> financialStatus = [
    'Stable Income',
    'Unstable Income',
    'In Debt',
    'Financially Dependent',
    'Saving for a Goal',
    'Struggling to Make Ends Meet',
    'Financially Secure',
  ];

  final List<String> socialSupport = [
    'Strong Social Network',
    'Limited Social Support',
    'No Close Friends or Family Nearby',
    'Rely on Community Support',
    'Isolated or Lonely',
  ];

  final List<String> religiousOrCulturalFactors = [
    'Practicing Religion',
    'Non-Practicing Religious',
    'Atheist or Agnostic',
    'Traditional Cultural Expectations',
    'No Cultural or Religious Affiliations',
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
              Padding(
                padding: EdgeInsets.only(left: 20),
                child: Text(
                  'General Information',
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              SizedBox(height: 20),
              _statusDropdown(),
              SizedBox(height: 10),
              _civilStatusdDropdown(),
              SizedBox(height: 10),
              _livingSituationDropdown(),
              SizedBox(height: 10),
              _financialStatusDropdown(),
              SizedBox(height: 10),
              _socialSupportDropdown(),
              SizedBox(height: 10),
              _religiousOrCulturalFactorsDropdown(),
              SizedBox(height: 30),
              Center(
                child: ElevatedButton(
                  onPressed: () {
                    if (selectedStatus != null &&
                        selectedCivilStatus != null &&
                        selectedLivingSituation != null &&
                        selectedFinancialStatus != null &&
                        selectedSocialSupport != null &&
                        selectedReligiousOrCulturalFactors != null &&
                        fullNameController.text.isNotEmpty) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => ScheduleSecond()),
                      );
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Please fill all the fields'),
                        ),
                      );
                    }
                  },
                  child: Text('Next'),
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

  DropdownButtonFormField _statusDropdown(){
    return DropdownButtonFormField<String>(
      decoration: InputDecoration(
        filled: true,
        fillColor: Color(0xff74B8FF).withOpacity(0.2),
        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 15),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10), // Add border radius here
          borderSide: BorderSide.none,
        ),
        prefixIcon: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: EdgeInsets.only(left: 10), // Add padding here
              child: Text(
                "Status: ",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
            ),
            SizedBox(width: 10), // Increase the space here
          ],
        ),
      ),
      hint: Text(
        "Select status",
        style: TextStyle(color: Colors.grey),
      ),
      icon: SvgPicture.asset(
        'assets/icons/dropdown.svg',
        height: 20,
        width: 20,
      ),
      value: selectedStatus,
      items: status.map((String status) {
        return DropdownMenuItem<String>(
          value: status,
          child: Text(status),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          selectedStatus = value;
        });
      },
    );
  }

  DropdownButtonFormField _civilStatusdDropdown(){
    return DropdownButtonFormField<String>(
      decoration: InputDecoration(
        filled: true,
        fillColor: Color(0xff74B8FF).withOpacity(0.2),
        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 15),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10), // Add border radius here
          borderSide: BorderSide.none,
        ),
        prefixIcon: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: EdgeInsets.only(left: 10), // Add padding here
              child: Text(
                "Civil Status: ",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
            ),
            SizedBox(width: 10), // Increase the space here
          ],
        ),
      ),
      hint: Text(
        "Select civil status",
        style: TextStyle(color: Colors.grey),
      ),
      icon: SvgPicture.asset(
        'assets/icons/dropdown.svg',
        height: 20,
        width: 20,
      ),
      value: selectedCivilStatus,
      items: civilStatus.map((String status) {
        return DropdownMenuItem<String>(
          value: status,
          child: Text(status),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          selectedCivilStatus = value;
        });
      },
    );
  }

  DropdownButtonFormField _livingSituationDropdown(){
    return DropdownButtonFormField<String>(
      decoration: InputDecoration(
        filled: true,
        fillColor: Color(0xff74B8FF).withOpacity(0.2),
        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 15),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10), // Add border radius here
          borderSide: BorderSide.none,
        ),
        prefixIcon: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: EdgeInsets.only(left: 10), // Add padding here
              child: Text(
                "Living Situation : ",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
            ),
            SizedBox(width: 10), // Increase the space here
          ],
        ),
      ),
      hint: Text(
        "Select living situation",
        style: TextStyle(color: Colors.grey),
      ),
      icon: SvgPicture.asset(
        'assets/icons/dropdown.svg',
        height: 20,
        width: 20,
      ),
      value: selectedLivingSituation,
      items: livingSituation.map((String status) {
        return DropdownMenuItem<String>(
          value: status,
          child: Text(status),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          selectedLivingSituation = value;
        });
      },
    );
  }

  DropdownButtonFormField _financialStatusDropdown(){
    return DropdownButtonFormField<String>(
      decoration: InputDecoration(
        filled: true,
        fillColor: Color(0xff74B8FF).withOpacity(0.2),
        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 15),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10), // Add border radius here
          borderSide: BorderSide.none,
        ),
        prefixIcon: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: EdgeInsets.only(left: 10), // Add padding here
              child: Text(
                "Income: ",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
            ),
            SizedBox(width: 10), // Increase the space here
          ],
        ),
      ),
      hint: Text(
        "Select financial status",
        style: TextStyle(color: Colors.grey),
      ),
      icon: SvgPicture.asset(
        'assets/icons/dropdown.svg',
        height: 20,
        width: 20,
      ),
      value: selectedFinancialStatus,
      items: financialStatus.map((String status) {
        return DropdownMenuItem<String>(
          value: status,
          child: Text(status),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          selectedFinancialStatus = value;
        });
      },
    );
  }

  DropdownButtonFormField _socialSupportDropdown(){
    return DropdownButtonFormField<String>(
      decoration: InputDecoration(
        filled: true,
        fillColor: Color(0xff74B8FF).withOpacity(0.2),
        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 15),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10), // Add border radius here
          borderSide: BorderSide.none,
        ),
        prefixIcon: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: EdgeInsets.only(left: 10), // Add padding here
              child: Text(
                "Social life :",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
            ),
            SizedBox(width: 10), // Increase the space here
          ],
        ),
      ),
      hint: Text(
        "Select social status",
        style: TextStyle(color: Colors.grey),
      ),
      icon: SvgPicture.asset(
        'assets/icons/dropdown.svg',
        height: 20,
        width: 20,
      ),
      value: selectedSocialSupport,
      items: socialSupport.map((String status) {
        return DropdownMenuItem<String>(
          value: status,
          child: Text(status),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          selectedSocialSupport = value;
        });
      },
    );
  }

  DropdownButtonFormField _religiousOrCulturalFactorsDropdown() {
    return DropdownButtonFormField<String>(
      decoration: InputDecoration(
        filled: true,
        fillColor: Color(0xff74B8FF).withOpacity(0.2),
        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 15),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide.none,
        ),
        prefixIcon: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: EdgeInsets.only(left: 10),
              child: Text(
                "Faith: ",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
            ),
            SizedBox(width: 10),
          ],
        ),
      ),
      hint: Text(
        "Select religious or cultural factors",
        style: TextStyle(color: Colors.grey),
      ),
      icon: SvgPicture.asset(
        'assets/icons/dropdown.svg',
        height: 20,
        width: 20,
      ),
      value: selectedReligiousOrCulturalFactors,
      items: religiousOrCulturalFactors.map((String status) {
        return DropdownMenuItem<String>(
          value: status,
          child: Text(status),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          selectedReligiousOrCulturalFactors = value;
        });
      },
    );
  }

  TextField _textField (){
    return TextField(
      controller: fullNameController,
      decoration: InputDecoration(
        filled: true,
        fillColor: Color(0xff74B8FF).withOpacity(0.2),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10), // Add border radius here
          borderSide: BorderSide.none,
        ),
        prefixIcon: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: EdgeInsets.only(left: 10), // Add padding here
              child: Text(
                "Status: ",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
              ),
            ),
            SizedBox(width: 10), // Increase the space here
          ],
        ),
        hintText: "Enter First name",
        hintStyle: TextStyle(
          color: Colors.grey, // Change this to your desired color
        ),
      ),
    );
  }
}