import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:thera_up/models/PastTModel.dart';
import 'package:thera_up/models/UpCommingTModel.dart';
import 'package:thera_up/pages/schedule.dart';
import 'package:intl/intl.dart';
import 'package:thera_up/pages/video_conference.dart';
import 'package:thera_up/pages/NewPage.dart';
import 'package:thera_up/services/SessionService.dart';
import 'package:thera_up/services/TherapyApiService.dart';
import 'package:http/http.dart' as http;
import 'dart:async';

class Therapy extends StatefulWidget {
  Therapy({Key? key}) : super(key: key);

  @override
  _TherapyState createState() => _TherapyState();
}

class _TherapyState extends State<Therapy> {
  List<UpCommingTModel> upComingTherapies = [];
  List<PastTModel> pastTherapies = [];
  bool _isLoading = false;

  final TherapyApiService _therapyApiService = TherapyApiService();

  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _fetchTherapies();
    // Start a timer to refresh UI every minute
    _timer = Timer.periodic(Duration(seconds: 30), (timer) {
      setState(() {
        // This will rebuild the widget and recheck _isSessionStartingSoon()
      });
    });
  }

  Future<void> _fetchTherapies() async {
    setState(() => _isLoading = true);

    try {
      final userId = await SessionService.getUserId();

      upComingTherapies = await _therapyApiService.getUpcomingTherapies(
          userId!); // Replace 1 with the actual patient ID
      pastTherapies = await _therapyApiService
          .getPastTherapies(userId); // Replace 1 with the actual patient ID
    } catch (e) {
      _showError(e.toString());
    }

    setState(() => _isLoading = false);
  }

  void _showError(String message) {
    print("Error: $message");
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message, style: const TextStyle(color: Colors.white)),
        backgroundColor: Colors.red,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar(),
      backgroundColor: Colors.white,
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Column(
                children: [
                  const SizedBox(height: 20),
                  _scheduleNow(),
                  const SizedBox(height: 30),
                  _upComing(),
                  const SizedBox(height: 30),
                  _pastTherapies(),
                  const SizedBox(height: 30),
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
          onTap: () async {
            // Call the first API to check for upcoming therapies
            final hasUpcomingTherapies = await _checkUpcomingTherapies();

            if (hasUpcomingTherapies == null) {
              // Handle API error
              return;
            }

            if (!hasUpcomingTherapies) {
              // If no upcoming therapies, navigate to the Schedule page
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const Schedule()),
              );
            } else {
              // If there are upcoming therapies, show a popup
              final shouldContinue = await _showConfirmationDialog();

              if (shouldContinue == true) {
                // Call the second API to delete pending sessions
                final success = await _deletePendingSessions();

                if (success) {
                  // Navigate to the Schedule page after deleting sessions
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const Schedule()),
                  );
                }
              }
            }
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

  Future<bool?> _checkUpcomingTherapies() async {
    try {
      final userId = await SessionService.getUserId();

      final response = await http.get(
        Uri.parse(
            'https://theraupbackend.pixelcore.lk/api/v1/theraup/schedule/check-schedules/$userId'),
        // Replace 1 with the actual user ID
        headers: {"Content-Type": "application/json"},
      );

      if (response.statusCode == 204) {
        // No upcoming therapies
        return false;
      } else if (response.statusCode == 200) {
        // Upcoming therapies exist
        return true;
      } else {
        // Handle other status codes
        _showError("Failed to check upcoming therapies");
        return null;
      }
    } catch (e) {
      _showError("Error: $e");
      return null;
    }
  }

  Future<bool?> _showConfirmationDialog() async {
    return await showDialog<bool>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text("Upcoming Therapies"),
          content: Text(
            "You have upcoming therapies. If you continue, all pending sessions will be canceled, but your progress will be kept. Do you want to continue?",
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(false); // No
              },
              child: Text("No"),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop(true); // Yes
              },
              child: Text("Yes"),
            ),
          ],
        );
      },
    );
  }

  Future<bool> _deletePendingSessions() async {
    try {
      final userId = await SessionService.getUserId();

      final response = await http.delete(
        Uri.parse(
            'https://theraupbackend.pixelcore.lk/api/v1/theraup/schedule/delete-pending-sessions/$userId'),
        // Replace 1 with the actual user ID
        headers: {"Content-Type": "application/json"},
      );

      if (response.statusCode == 200) {
        // Sessions deleted successfully
        return true;
      } else {
        // Handle other status codes
        _showError("Failed to delete pending sessions");
        return false;
      }
    } catch (e) {
      _showError("Error: $e");
      return false;
    }
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
          height: 320, // Set a fixed height
          child: ListView.separated(
            separatorBuilder: (context, index) {
              return SizedBox(width: 20);
            },
            itemCount: upComingTherapies.length,
            itemBuilder: (context, index) {
              return Container(
                width: 250,
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
                        "Session ID: ${upComingTherapies[index].sessionId}",
                        style: TextStyle(
                          color: Colors.black87,
                          fontSize: 16,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
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
                            '${upComingTherapies[index].duration}  |',
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Text(
                            upComingTherapies[index].paid
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
                          onPressed: _isSessionStartingSoon(
                            upComingTherapies[index].date,
                            upComingTherapies[index].time,
                            upComingTherapies[index].sessionDuration,
                          )
                              ? () {
                                  _joinTherapySession(
                                      context, upComingTherapies[index].sessionId);
                                }
                              : null,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blueAccent,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: Text(
                            "Join",
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                      ),
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

  Column _pastTherapies() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.only(left: 20),
          child: Text(
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
                            backgroundColor: pastTherapies[index].status ==
                                    'completed'
                                ? Colors.green
                                : pastTherapies[index].status == 'Not completed'
                                    ? Colors.red
                                    : pastTherapies[index].status == 'N/A'
                                        ? Colors.grey
                                        : pastTherapies[index].status ==
                                                'Ongoing'
                                            ? Colors.amber
                                            : Colors.blue,
                            shape: StadiumBorder(
                              side:
                                  BorderSide.none, // Ensures no visible border
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
                            '${pastTherapies[index].duration}',
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const Spacer(),
                          Row(
                            children: [
                              const Icon(Icons.star,
                                  color: Colors.amber, size: 18),
                              const SizedBox(width: 4),
                              Text(
                                pastTherapies[index].rating.isEmpty
                                    ? 'Rate Therapy'
                                    : pastTherapies[index].rating,
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
        ),
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

bool _isSessionStartingSoon(
    String sessionDate, String sessionTime, int sessionDuration) {
  try {
    // Parse session date (example "2025-04-14")
    DateTime parsedDate = DateFormat("yyyy-MM-dd").parse(sessionDate);

    // Parse session time (example "10:35:00")
    DateTime parsedTime = DateFormat("HH:mm:ss").parse(sessionTime);

    // Combine date and time into one DateTime object
    DateTime sessionStart = DateTime(
      parsedDate.year,
      parsedDate.month,
      parsedDate.day,
      parsedTime.hour,
      parsedTime.minute,
      parsedTime.second,
    );

    // Calculate session end time
    DateTime sessionEnd = sessionStart.add(Duration(minutes: sessionDuration));

    DateTime now = DateTime.now();

    // Allow joining 10 minutes before sessionStart and while session ongoing
    return now.isAfter(sessionStart.subtract(Duration(minutes: 10))) &&
        now.isBefore(sessionEnd);
  } catch (e) {
    print("Error parsing date/time/duration: $e");
    return false;
  }
}

void _joinTherapySession(BuildContext context, String sessionId) {
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
              Navigator.push(context,
                  MaterialPageRoute(builder: (context) => MainScreen(sessionId: sessionId)));
            },
          ),
        ],
      );
    },
  );
}
