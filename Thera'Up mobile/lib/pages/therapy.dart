import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:thera_up/models/pastT_model.dart';
import 'package:thera_up/models/upCommingT_model.dart';

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
      body: ListView(
        children: [
          const SizedBox(height: 20),
          _scheduleNow(),
          const SizedBox(height: 30),
          _upComing(),
          const SizedBox(height: 30,),
          Column(
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
                                      : pastTherapies[index].status == 'Ongoing'
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
                                    const Icon(Icons.star, color: Colors.amber,
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
          )
        ],
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
        Container(
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
          height: 240, // Set a fixed height
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

  void _showRatingDialog(BuildContext context, int index) {
    double selectedRating = 0.0; // Initialize the selected rating

    showDialog(
      context: context,
      builder: (BuildContext context) {
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
                const SizedBox(height: 20,),
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
                        selectedRating = (starIndex + 1).toDouble(); // Set rating
                      },
                      icon: Icon(
                        Icons.star,
                        color: starIndex < selectedRating ? Colors.amber : Colors.grey,
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
                Navigator.of(context).pop(); // Close the dialog without saving
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
  }
}
