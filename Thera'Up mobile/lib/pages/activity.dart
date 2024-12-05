import 'package:flutter/material.dart';
import 'per_activity.dart'; // Import the renamed PerActivity class

class Activity extends StatelessWidget {
  const Activity({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar(),
      backgroundColor: Color(0xFFFAF9F6),
      body: ActivitiesOverview(),
    );
  }

  AppBar appBar() {
    return AppBar(
      centerTitle: true,
      title: Text(
        'Activity Page',
        style: TextStyle(
          color: Colors.black,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
      ),
      automaticallyImplyLeading: false,
      backgroundColor: Colors.transparent,
      elevation: 0,
    );
  }
}

class ActivitiesOverview extends StatefulWidget {
  @override
  _ActivitiesOverviewState createState() => _ActivitiesOverviewState();
}

class _ActivitiesOverviewState extends State<ActivitiesOverview> {
  int totalActivitiesCompleted = 12; // Example data
  String totalTimeSpent = "5h 30m"; // Example data
  List<ActivityModel> availableActivities = [
    ActivityModel("Reading", 0.7, Icons.book),
    ActivityModel("Meditation", 0.4, Icons.self_improvement),
    ActivityModel("Yoga", 0.9, Icons.spa),
    ActivityModel("Writing", 0.3, Icons.edit),
  ];

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: EdgeInsets.all(20.0),
      children: [
        _overviewSection(),
        const SizedBox(height: 30),
        _availableActivitiesSection(),
      ],
    );
  }

  Widget _overviewSection() {
    return Container(
      padding: EdgeInsets.all(20.0),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Color(0xFFCEE6FF), // Soft pastel blue
            Color(0xFFE2C3F8), // Light lavender (complementary to blue)
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 20,
            spreadRadius: 5,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Overview",
            style: TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _overviewCard("Completed", "$totalActivitiesCompleted"),
              _overviewCard("Time Spent", totalTimeSpent),
            ],
          ),
        ],
      ),
    );
  }


  Widget _overviewCard(String title, String value) {
    return Container(
      width: MediaQuery.of(context).size.width / 2.5,
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            spreadRadius: 3,
            offset: Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(fontSize: 18, color: Colors.black54),
          ),
          const SizedBox(height: 10),
          Text(
            value,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
        ],
      ),
    );
  }

  Widget _availableActivitiesSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Available Activities",
          style: TextStyle(
            fontSize: 26,
            fontWeight: FontWeight.w700,
            color: Colors.black,
          ),
        ),
        const SizedBox(height: 20),
        ListView.separated(
          shrinkWrap: true,
          physics: NeverScrollableScrollPhysics(),
          itemCount: availableActivities.length,
          separatorBuilder: (context, index) => const SizedBox(height: 20),
          itemBuilder: (context, index) {
            final activity = availableActivities[index];
            return _activityCard(activity);
          },
        ),
      ],
    );
  }

  Widget _activityCard(ActivityModel activity) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => PerActivity(
              activityName: activity.name,
              allocatedTime: activity.progress * 2,
              location: "Room 101",
            ),
          ),
        );
      },
      child: AnimatedContainer(
        duration: Duration(milliseconds: 300),
        padding: EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color(0xFFCEE6FF).withOpacity(1), // Soft pastel blue (fully opaque)
              Color(0xFFFFFFFF).withOpacity(1), // White (fully opaque)
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(15),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 15,
              spreadRadius: 5,
              offset: Offset(0, 8),
            ),
          ],
        ),
        child: Row(
          children: [
            Icon(activity.icon, color: Colors.black, size: 40),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    activity.name,
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w600,
                      color: Colors.black,
                    ),
                  ),
                  const SizedBox(height: 10),
                  LinearProgressIndicator(
                    value: activity.progress,
                    backgroundColor: Colors.grey[300],
                    color: Color(0xffFFA726),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    "${(activity.progress * 100).toInt()}% completed",
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.black,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ActivityModel {
  final String name;
  final double progress;
  final IconData icon;

  ActivityModel(this.name, this.progress, this.icon);
}
