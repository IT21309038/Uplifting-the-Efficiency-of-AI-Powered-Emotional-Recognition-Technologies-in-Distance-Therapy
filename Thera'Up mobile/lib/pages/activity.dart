import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'per_activity.dart';
import 'package:thera_up/main.dart';

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

class _ActivitiesOverviewState extends State<ActivitiesOverview> with RouteAware {
  int totalActivities = 0;
  int completedActivities = 0;
  String totalTimeAssigned = "0 min";
  List<ActivityModel> availableActivities = [];
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    fetchActivityData();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    routeObserver.subscribe(this, ModalRoute.of(context)!);
  }

  @override
  void dispose() {
    routeObserver.unsubscribe(this);
    super.dispose();
  }

  @override
  void didPopNext() {
    // Called when coming back to this page
    fetchActivityData();
  }

  Future<void> fetchActivityData() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final response = await http.get(
        Uri.parse('https://theraupbackend.pixelcore.lk/api/v1/theraup/postTherapy/progress/1'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body)['data'];
        setState(() {
          totalActivities = data['totalActivities'] ?? 0;
          completedActivities = data['completedActivities'] ?? 0;
          totalTimeAssigned = "${data['totalTimeAssigned'] ?? 0} min";

          // Handle duplicates by selecting the entry with highest completion_percentage
          final uniqueActivities = <String, Map>{};
          for (var activity in data['activityProgressList']) {
            final currentId = activity['activity_id'];
            if (!uniqueActivities.containsKey(currentId) ||
                (activity['completion_percentage'] as num) >
                    (uniqueActivities[currentId]!['completion_percentage'] as num)) {
              uniqueActivities[currentId] = activity;
            }
          }

          availableActivities = uniqueActivities.values.map((activity) {
            return ActivityModel(
              activity['activity_name'],
              (activity['completion_percentage'] as num).toDouble(),
              _getIconForActivity(activity['activity_name']),
              activity['activity_id'],
              (activity['remaining_time'] as num).toDouble(), // remaining_time is in minutes
            );
          }).toList();
          isLoading = false;
        });
      } else {
        throw Exception('Failed to load data: Status ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching data: $e');
      setState(() {
        isLoading = false;
        errorMessage = 'Failed to connect to server. Please check your connection and try again.';
        // Fallback to mock data (matches the latest API response)
        totalActivities = 6;
        completedActivities = 1;
        totalTimeAssigned = "120 min";
        availableActivities = [
          ActivityModel("Guided Meditation", 50.0, Icons.self_improvement, "ACT002", 10.0),
          ActivityModel("Light Stretching", 0.0, Icons.fitness_center, "ACT025", 20.0),
          ActivityModel("Clay Shaping", 0.0, Icons.brush, "ACT040", 25.0),
          ActivityModel("Deep Breathing", 100.0, Icons.air, "ACT001", 0.0),
        ];
      });
    }
  }

  IconData _getIconForActivity(String name) {
    switch (name.toLowerCase()) {
      case 'guided meditation':
        return Icons.self_improvement;
      case 'light stretching':
        return Icons.fitness_center;
      case 'clay shaping':
        return Icons.brush;
      case 'deep breathing':
        return Icons.air;
      default:
        return Icons.event;
    }
  }

  @override
  Widget build(BuildContext context) {
    return isLoading
        ? Center(child: CircularProgressIndicator())
        : errorMessage != null
        ? Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            errorMessage!,
            style: TextStyle(fontSize: 16, color: Colors.red),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 20),
          ElevatedButton(
            onPressed: fetchActivityData,
            child: Text('Retry'),
          ),
          SizedBox(height: 20),
          Text(
            'Showing offline data',
            style: TextStyle(fontSize: 14, color: Colors.grey),
          ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.all(20.0),
              children: [
                _overviewSection(),
                const SizedBox(height: 30),
                _availableActivitiesSection(),
              ],
            ),
          ),
        ],
      ),
    )
        : ListView(
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
            Color(0xFFCEE6FF),
            Color(0xFFE2C3F8),
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
              _overviewCard("Completed", "$completedActivities"),
              _overviewCard("Time Assigned", totalTimeAssigned),
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
              allocatedTime: activity.remainingTime, // In minutes
              location: "Room 101",
              activityId: activity.activityId,
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
              Color(0xFFCEE6FF).withOpacity(1),
              Color(0xFFFFFFFF).withOpacity(1),
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
                    value: activity.progress / 100, // Convert percentage to 0-1 scale
                    backgroundColor: Colors.grey[300],
                    color: Color(0xffFFA726),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    "${activity.progress.toInt()}% completed",
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
  final double progress; // In percentage (0-100)
  final IconData icon;
  final String activityId;
  final double remainingTime; // In minutes

  ActivityModel(this.name, this.progress, this.icon, this.activityId, this.remainingTime);
}