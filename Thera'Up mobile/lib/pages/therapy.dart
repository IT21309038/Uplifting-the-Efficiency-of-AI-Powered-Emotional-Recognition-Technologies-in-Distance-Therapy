import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:thera_up/models/pastT_model.dart';
import 'package:thera_up/models/upCommingT_model.dart';
import 'package:thera_up/pages/schedule.dart';
import 'package:intl/intl.dart';
import 'package:thera_up/pages/video_conference.dart';
import 'package:thera_up/pages/NewPage.dart';


class Therapy extends StatefulWidget {
   Therapy({Key? key}) : super(key: key);

  @override
  _TherapyState createState() => _TherapyState();
}

class _TherapyState extends State<Therapy> {

  List<UpCommingTModel> upComingTherapies = [];
  List<PastTModel> pastTherapies = [];

  @override
  void initState() {
    super.initState();
    _getUpcomingTherapies();
    _getPastTherapies();
  }

  void _getUpcomingTherapies() {
    upComingTherapies = UpCommingTModel.getUpCommingT();
  }

  void _getPastTherapies() {
    pastTherapies = PastTModel.getPastT();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar(),
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 20),
            _scheduleNow(),
            const SizedBox(height: 30),
            _upComing(),
            const SizedBox(height: 30,),
            _pastTherapies(),
            const SizedBox(height: 30,),
          ],
        ),
      ),
    );
  }

  AppBar appBar() {
    return AppBar(
      centerTitle: true,
      title: Text(
        'Therapy Page',
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

  Column _scheduleNow() {
    return Column(
      children: [
      GestureDetector(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const Schedule()),
          );
        },
        child: Container(
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
                ),
              ],
            ),
          ),
        ),
      ),
      ],
    );
  }

  Column _upComing() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.only(left: 20),
          child: Text(
            'Upcoming Therapies',
            style: TextStyle(
              color: Colors.black,
              fontSize: 24,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        SizedBox(height: 20),
        Container(
          height: 290, // Set a fixed height
          child: ListView.separated(
            separatorBuilder: (context, index) {
              return SizedBox(width: 20);
            },
            itemCount: upComingTherapies.length,
            itemBuilder: (context, index) {
              return Container(
                width: 210,
                decoration: BoxDecoration(
                  color: (index % 2 == 0)
                      ? Color(0xff9DCEFF).withOpacity(0.5)
                      : Color(0xFFc588F2).withOpacity(0.5),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Padding(
                  padding: EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(height: 10),
                      Text(
                        upComingTherapies[index].date,
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 24,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      SizedBox(height: 10),
                      Text(
                        upComingTherapies[index].therapist,
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 20,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      SizedBox(height: 10),
                      Text(
                        upComingTherapies[index].time,
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 18,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      SizedBox(height: 10),
                      Row(
                        children: [
                          SizedBox(width: 10),
                          Text(
                            upComingTherapies[index].duration + '  |',
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Text(
                            (upComingTherapies[index].paid ?? false)
                                ? '  Paid'
                                : '  Pending',
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          
                        ],
                      ),
                      SizedBox(height: 10),
                      Center(
                        child: ElevatedButton(
                          onPressed: _isSessionStartingSoon(upComingTherapies[index].date ,upComingTherapies[index].time)
                              ? () {
                            _joinTherapySession( this.context ,upComingTherapies[index].time);
                          }
                              : null, // Disable button if session is not within 5 minutes,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blueAccent, // Button color
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: Text(
                            "Join",
                            style: TextStyle(color: Colors.white),
                          ),
                      )
                      )


                    ],
                  ),
                ),
              );
            },
            scrollDirection: Axis.horizontal,
            padding: EdgeInsets.only(left: 20, right: 20),
          ),
        ),
      ],
    );
  }

  // Column _newBlank(BuildContext context) {
  //   return Column(
  //     crossAxisAlignment: CrossAxisAlignment.start, // Aligns the button to the left
  //     children: [
  //       Align(
  //         alignment: Alignment.centerLeft,
  //         child: ElevatedButton(
  //           onPressed: () {
  //             Navigator.push(
  //               context,
  //               MaterialPageRoute(builder: (context) => MainScreen()), // Navigate to NewPage
  //             );
  //           },
  //           style: ElevatedButton.styleFrom(
  //             backgroundColor: Colors.blue, // Button color
  //             foregroundColor: Colors.white, // Text color
  //           ),
  //           child: Text("New Page"),
  //         ),
  //       ),
  //     ],
  //   );
  // }

  Column _pastTherapies(){
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(padding: EdgeInsets.only(left: 20),
          child:
          Text(
            "Past Therapies",
            style: TextStyle(
              color: Colors.black,
              fontSize: 24,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        SizedBox(height: 20),
        ListView.separated(
          shrinkWrap: true,
          physics: NeverScrollableScrollPhysics(),
          padding: EdgeInsets.only(left: 20, right: 20),
          itemBuilder: (context, index) {
            return GestureDetector(
              onTap: () {
                if (pastTherapies[index].rating.isEmpty) {
                  _showRatingDialog(context, index);
                }
              },
              child: Container(
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
                child: Padding(
                  padding: EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(height: 10),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          Text(
                            pastTherapies[index].therapist,
                            style: TextStyle(
                              color: Colors.black,
                              fontSize: 24,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const Spacer(),
                          Chip(
                            label: Text(
                              pastTherapies[index].status,
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            backgroundColor: pastTherapies[index]
                                .status == 'Completed'
                                ? Colors.green
                                : pastTherapies[index].status ==
                                'Not completed'
                                ? Colors.red
                                : pastTherapies[index].status == 'N/A'
                                ? Colors.grey
                                : pastTherapies[index].status ==
                                'Ongoing'
                                ? Colors.amber
                                : Colors.blue,
                            shape: StadiumBorder(
                              side: BorderSide
                                  .none, // Ensures no visible border
                            ),
                          ),

                        ],
                      ),
                      SizedBox(height: 10),
                      Text(
                        pastTherapies[index].date,
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 20,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      SizedBox(height: 10),
                      Row(
                        children: [
                          Text(
                            pastTherapies[index].duration + '',
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const Spacer(),
                          Row(
                            children: [
                              const Icon(
                                  Icons.star, color: Colors.amber,
                                  size: 18),
                              // Star icon
                              const SizedBox(width: 4),
                              // Space between star and text
                              Text(
                                pastTherapies[index].rating.isEmpty
                                    ? 'Rate Therapy'
                                    : pastTherapies[index].rating
                                    .toString(), // Example rating value
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
                    ],
                  ),
                ),
              ),
            );
          },
          separatorBuilder: (context, index) {
            return SizedBox(height: 25);
          },
          itemCount: pastTherapies.length,
        )
      ],
    );
  }

  void _showRatingDialog(BuildContext context, int index) {
    double selectedRating = 0.0; // Initialize the selected rating

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: const Text(
                'Rate Your Therapy',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              content: Container(
                width: 300, // Set the desired width
                height: 150, // Set the desired height
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const SizedBox(height: 20),
                    const Text(
                      'Please rate your experience:',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                    const SizedBox(height: 30),
                    // Row for Star Ratings
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(5, (starIndex) {
                        return IconButton(
                          onPressed: () {
                            setState(() {
                              selectedRating = (starIndex + 1).toDouble();
                            });
                          },
                          icon: Icon(
                            Icons.star,
                            color: starIndex < selectedRating
                                ? Colors.amber
                                : Colors.grey,
                            size: 30,
                          ),
                        );
                      }),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.of(context)
                        .pop(); // Close the dialog without saving
                  },
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: () {
                    // Save the rating
                    pastTherapies[index].rating = selectedRating.toString();
                    Navigator.of(context).pop(); // Close the dialog
                    // Optionally, you can call setState() here to refresh the UI
                  },
                  child: const Text('Submit'),
                ),
              ],
            );
          },
        );
      },
    );
  }
}

bool _isSessionStartingSoon(String sessionDate ,String sessionTime) {
  // try {
  //   // Convert sessionTime to DateTime format
  //   DateTime now = DateTime.now();
  //   DateTime sessionDateTime = DateFormat("hh:mm a").parse(sessionTime);
  //
  //   // Convert session time to today's date
  //   DateTime todaySession = DateTime(
  //       now.year, now.month, now.day,
  //       sessionDateTime.hour, sessionDateTime.minute
  //   );
  //
  //   // Check if the session starts within the next 5 minutes
  //   return todaySession.difference(now).inMinutes <= 5 &&
  //       todaySession.difference(now).inMinutes >= 0;
  // } catch (e) {
  //   print("Error parsing session time: $e");
  //   return false;
  // }
  try {
    // Define the target date (12th July 2021)
    DateTime targetDate = DateTime(2021, 7, 12);

    // Parse the session date (format: "Monday, 12 July 2021")
    DateTime parsedDate = DateFormat("EEEE, d MMMM yyyy").parse(sessionDate);

    // Parse the session time (format: "10:00 AM")
    DateTime parsedTime = DateFormat("hh:mm a").parse(sessionTime);

    // Convert session time to full DateTime
    DateTime sessionDateTime = DateTime(
        parsedDate.year, parsedDate.month, parsedDate.day,
        parsedTime.hour, parsedTime.minute
    );

    DateTime now = DateTime.now(); // Get current time

    // Check if the session is on 12th July 2021 AND the time has not passed
    return parsedDate.year == targetDate.year &&
        parsedDate.month == targetDate.month &&
        parsedDate.day == targetDate.day ;
  } catch (e) {
    print("Error parsing date/time: $e");
    return false;
  }
}

void _joinTherapySession(BuildContext context, String meetingUrl) {
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: Text("Joining Therapy Session"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.video_call, size: 50, color: Colors.blue),
            SizedBox(height: 10),
            Text(
              "You are about to join the therapy session.",
              textAlign: TextAlign.center,
            ),
          ],
        ),
        actions: [
          TextButton(
            child: Text("Cancel"),
            onPressed: () {
              Navigator.pop(context);
              print("Join canceled");
            },
          ),
          ElevatedButton(
            child: Text("Join Now"),
            onPressed: () {
              Navigator.pop(context);
              Navigator.push(context, MaterialPageRoute(builder: (context) => MainScreen()));

              // print("Joining session: $meetingUrl");
            },
          ),
        ],
      );
    },
  );
}
