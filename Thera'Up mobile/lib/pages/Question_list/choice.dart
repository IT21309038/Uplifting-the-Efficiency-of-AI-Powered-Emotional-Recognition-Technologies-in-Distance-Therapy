import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:percent_indicator/percent_indicator.dart';
import 'package:thera_up/models/TherapySession.dart';
import 'package:thera_up/pages/appointment_suggestions.dart';
import 'package:thera_up/services/PhysicalApiService.dart';
import 'package:thera_up/services/SessionService.dart';
import 'package:external_app_launcher/external_app_launcher.dart';
import 'package:http/http.dart' as http;

class Choice extends StatefulWidget {
  final String? selectedSleepOption;
  final String? selectedEatOption;
  final String? selectedOverwhelmedOption;
  final String? selectedAngryOption;
  final String? selectedFocusOption;
  final String? selectedMemoryOption;
  final String? selectedSocialOption;
  final String? selectedPhysicalOption;
  final String? selectedHeadacheOption;
  final String? selectedNegativeOption;

  const Choice({super.key,
    this.selectedSleepOption,
    this.selectedEatOption,
    this.selectedOverwhelmedOption,
    this.selectedAngryOption,
    this.selectedFocusOption,
    this.selectedMemoryOption,
    this.selectedSocialOption,
    this.selectedPhysicalOption,
    this.selectedHeadacheOption,
    this.selectedNegativeOption
  });

  @override
  State<Choice> createState() => _ChoiceState();
}

class _ChoiceState extends State<Choice> {
  int? stressScore;
  String stressLevel = '';
  bool showValidateButton = true;
  int? userAge;
  bool isLoading = false;
  bool isGeneratingSession = false;

  final PhysicalApiService _apiService = PhysicalApiService();

  @override
  void initState() {
    super.initState();
    _calculateStressScore();
    _getUserAge();
    _saveDataToApi();
  }

  Future<void> _generateSessionSchedule() async {
    setState(() {
      isGeneratingSession = true;
    });

    try {
      final userId = await SessionService.getUserId();
      if (userId != null) {
        final url = Uri.parse('https://theraupbackend.pixelcore.lk/api/v1/theraup/schedule/generate-schedule/$userId');
        final response = await http.get(url);

        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          print(response.body);
          final List<TherapySession> sessions = (data['data'] as List)
              .map((sessionJson) => TherapySession.fromJson(sessionJson))
              .toList();

          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => AppointmentSuggestions(scheduleData: sessions),
            ),
          );

        } else {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Failed to generate schedule: ${response.statusCode}')),
            );
          }
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Failed to get user ID')),
          );
        }
      }
    } catch (e) {
      print(e);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error generating schedule: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          isGeneratingSession = false;
        });
      }
    }
  }

  void _calculateStressScore() {
    int score = 0;

    // Mapping options to stress values
    Map<String, int> sleepOptions = {'less than 4': 4, '4-6 hours': 3, '6-8 hours': 2, 'more than 8': 1};
    Map<String, int> eatOptions = {'Eating Less': 4, 'Eating More': 3, 'No Change': 2, 'Lost Appetite': 1};
    Map<String, int> otherOptions = {'Always': 4, 'Often': 3, 'Sometimes': 2, 'Never': 1};
    Map<String, int> physicalOptions = {'Always': 1, 'Often': 2, 'Sometimes': 3, 'Never': 4};

    score += sleepOptions[widget.selectedSleepOption] ?? 0;
    score += eatOptions[widget.selectedEatOption] ?? 0;
    score += otherOptions[widget.selectedOverwhelmedOption] ?? 0;
    score += otherOptions[widget.selectedAngryOption] ?? 0;
    score += otherOptions[widget.selectedFocusOption] ?? 0;
    score += otherOptions[widget.selectedMemoryOption] ?? 0;
    score += otherOptions[widget.selectedSocialOption] ?? 0;
    score += physicalOptions[widget.selectedPhysicalOption] ?? 0;
    score += otherOptions[widget.selectedHeadacheOption] ?? 0;
    score += otherOptions[widget.selectedNegativeOption] ?? 0;

    setState(() {
      stressScore = score;
      if (score >= 27) {
        stressLevel = 'High Stress';
      } else if (score >= 14) {
        stressLevel = 'Moderate Stress';
      } else {
        stressLevel = 'Low Stress';
      }
    });
  }

  Future<void> _getUserAge() async {
    final prefs = await SharedPreferences.getInstance();
    String dob = prefs.getString('dob') ?? '';
    if (dob.isNotEmpty) {
      DateTime birthDate = DateTime.parse(dob);
      DateTime currentDate = DateTime.now();
      int age = currentDate.year - birthDate.year;
      if (currentDate.month < birthDate.month || (currentDate.month == birthDate.month && currentDate.day < birthDate.day)) {
        age--;
      }
      setState(() {
        userAge = age;
        showValidateButton = age >= 15 && age <= 40;
      });
    }
  }

  Future<void> _saveDataToApi() async {
    setState(() {
      isLoading = true;
    });

    try {
      final userId = await SessionService.getUserId();
      if (userId != null) {
        final Map<String, dynamic> data = {
          "patientId": userId, // Use the actual user ID
          "sleepOption": widget.selectedSleepOption,
          "eatOption": widget.selectedEatOption,
          "overwhelmedOption": widget.selectedOverwhelmedOption,
          "angryOption": widget.selectedAngryOption,
          "focusOption": widget.selectedFocusOption,
          "memoryOption": widget.selectedMemoryOption,
          "socialOption": widget.selectedSocialOption,
          "physicalOption": widget.selectedPhysicalOption,
          "negativeOption": widget.selectedNegativeOption,
          "stressScore": stressScore?.toDouble(),
        };

        await _apiService.savePhysicalInfo(data);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to get user ID from session')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error saving data: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  Future<void> _onValidatePressed() async {
    setState(() {
      isLoading = true;
    });

    try {
      await LaunchApp.openApp(
        androidPackageName: 'com.SentinalsOfLight.Interactive',

        // set to true if you want to open Play Store if not installed
      );
    } catch (e) {
      // Handle error if app not found or other issues
      print("Failed to launch app: $e");
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar(),
      backgroundColor: Colors.white,
      body: ListView(
        children: [
          const SizedBox(height: 20),
          Center(
            child: Image.asset(
              stressLevel == 'High Stress'
                  ? 'assets/images/high_stress.jpg'
                  : stressLevel == 'Moderate Stress'
                  ? 'assets/images/moderate_stress.jpg'
                  : 'assets/images/low_stress.jpg',
              height: 250,
            ),
          ),
          const SizedBox(height: 20),
          Center(
            child: Text(
              'You are $stressLevel',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(height: 60),
          if (stressScore != null)
            Center(
              child: CircularPercentIndicator(
                radius: 100.0,
                lineWidth: 15.0,
                percent: stressScore! / 40,
                center: Text(
                  '$stressScore/40',
                  style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
                progressColor: stressLevel == 'High Stress'
                    ? Colors.red
                    : stressLevel == 'Moderate Stress'
                    ? Colors.orange
                    : Colors.green,
                backgroundColor: Colors.grey[200]!,
                circularStrokeCap: CircularStrokeCap.round,
              ),
            ),
          const SizedBox(height: 60),
          if (showValidateButton && userAge != null && userAge! >= 15 && userAge! <= 40)
            Center(
              child: Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Colors.blue, Colors.purple],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(30),
                ),
                child: ElevatedButton(
                  onPressed: isLoading ? null : _onValidatePressed,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    shadowColor: Colors.transparent,
                    padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                  child: isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text(
                    'Validate',
                    style: TextStyle(fontSize: 18, color: Colors.white),
                  ),
                ),
              ),
            ),
          if (!showValidateButton || userAge == null || userAge! < 15 || userAge! > 40)
            Center(
              child: Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Colors.green, Colors.lightGreen],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(30),
                ),
                child: ElevatedButton(
                  onPressed: isGeneratingSession ? null : _generateSessionSchedule,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    shadowColor: Colors.transparent,
                    padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                  child: isGeneratingSession
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text(
                    'Generate Session',
                    style: TextStyle(fontSize: 18, color: Colors.white),
                  ),
                ),
              ),
            ),
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
}

class BarGraphPainter extends CustomPainter {
  final int stressScore;

  BarGraphPainter(this.stressScore);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.blue
      ..style = PaintingStyle.fill;

    final barWidth = size.width / 40;
    final barHeight = size.height * (stressScore / 40);

    canvas.drawRect(
      Rect.fromLTWH(0, size.height - barHeight, barWidth * stressScore, barHeight),
      paint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}