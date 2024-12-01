import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:thera_up/models/appointment_suggestion_model.dart';

class AppointmentSuggestions extends StatefulWidget {
  const AppointmentSuggestions({super.key});

  @override
  State<AppointmentSuggestions> createState() => _AppointmentSuggestionsState();
}

class _AppointmentSuggestionsState extends State<AppointmentSuggestions> {
  List<AppointmentSuggestionsModel> appointmentSuggestions = [];

  @override
  void initState() {
    super.initState();
    _getAppointmentSuggestions();
  }

  void _getAppointmentSuggestions() {
    setState(() {
      appointmentSuggestions = AppointmentSuggestionsModel.getAppointmentSuggestionsModel();
    });
  }

  @override
  Widget build(BuildContext context) {
    return  Scaffold(
      appBar: appBar(context),
      backgroundColor: Colors.white,
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Padding(padding: const EdgeInsets.only(left: 20),
          //     child:Text(
          //       'Select One',
          //       style: TextStyle(
          //         color: Colors.black,
          //         fontSize: 18,
          //         fontWeight: FontWeight.w600,
          //       ),
          //     )),
          SizedBox(height: 30),
          Expanded(
            child: ListView.separated(
              padding: EdgeInsets.only(left: 20, right: 20),
              itemBuilder: (context, index) {
                return Container(
                  padding: EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Color(0xff1D1617).withOpacity(0.1),
                        offset: Offset(0, 10),
                        spreadRadius: 0,
                        blurRadius: 40,
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          CircleAvatar(
                            radius: 30,
                            backgroundImage: NetworkImage(appointmentSuggestions[index].image),
                          ),
                          SizedBox(width: 20),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                appointmentSuggestions[index].doctorName,
                                style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 18,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                appointmentSuggestions[index].designation,
                                style: TextStyle(
                                  color: Color(0xff786f72),
                                  fontSize: 13,
                                  fontWeight: FontWeight.w400,
                                ),
                              ),
                            ],
                          ),
                          Expanded(child: Container()), // This will push the rating to the right end
                          Row(
                            children: [
                              const Icon(
                                Icons.star, color: Colors.amber,
                                size: 18,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                appointmentSuggestions[index].rating.toString(),
                                style: const TextStyle(
                                  color: Colors.grey,
                                  fontSize: 16,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Container(
                        padding: EdgeInsets.all(15), // Add left and right padding
                        margin: EdgeInsets.only(top: 10),
                        height: 85,
                        decoration: BoxDecoration(
                          color: Color(0xffE8E8E8),
                          borderRadius: BorderRadius.circular(10), // Make the corners rounded
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    SizedBox(width: 4),
                                    Text(
                                      '${appointmentSuggestions[index].Date}',
                                      style: TextStyle(
                                        fontSize: 14,
                                      ),
                                    ),
                                  ],
                                ),
                                Text(
                                  '${appointmentSuggestions[index].time}',
                                  style: TextStyle(
                                    fontSize: 14,
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 8),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    SizedBox(width: 4),
                                    Text(
                                      ' ${appointmentSuggestions[index].duration}',
                                      style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w400,
                                      ),
                                    ),
                                  ],
                                ),
                                Text(
                                  "${appointmentSuggestions[index].price}",
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      SizedBox(height: 10),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () {
                              _showPullUpDialog(context);
                          },
                          style: ElevatedButton.styleFrom(
                            padding: EdgeInsets.zero,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.all(Radius.circular(15)),
                            ),
                          ),
                          child: Ink(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Color(0xff9DCEFF),
                                  Color(0xff92A3FD),
                                ],
                              ),
                              borderRadius: BorderRadius.all(Radius.circular(15)),
                            ),
                            child: Container(
                              alignment: Alignment.center,
                              constraints: BoxConstraints(
                                minHeight: 40,
                              ),
                              child: Text(
                                "Book Appointment",
                                style: TextStyle(color: Colors.white),
                              ),

                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
              separatorBuilder: (context, index) {
                return SizedBox(height: 25);
              },
              itemCount: appointmentSuggestions.length,
            ),
          ),

        ],
      ),
    );
  }

  void _showPullUpDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(16),
        ),
      ),
      builder: (BuildContext context) {
        return Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Handle Bar
              Center(
                child: Container(
                  width: 50,
                  height: 5,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              SizedBox(height: 20),
              // Title
              Text(
                "Select an Option",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 20),
              // Option 1
              ListTile(
                leading: Icon(Icons.person, color: Colors.blue),
                title: Text("Profile"),
                onTap: () {
                  // Handle Profile action
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Profile Selected")),
                  );
                },
              ),
              Divider(),
              // Option 2
              ListTile(
                leading: Icon(Icons.settings, color: Colors.blue),
                title: Text("Settings"),
                onTap: () {
                  // Handle Settings action
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Settings Selected")),
                  );
                },
              ),
              Divider(),
              // Option 3
              ListTile(
                leading: Icon(Icons.logout, color: Colors.red),
                title: Text("Logout"),
                onTap: () {
                  // Handle Logout action
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Logged Out")),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  AppBar appBar(BuildContext context) {
    return AppBar(
      centerTitle: true,
      title: Text(
        'Appointment Suggestions',
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
}


