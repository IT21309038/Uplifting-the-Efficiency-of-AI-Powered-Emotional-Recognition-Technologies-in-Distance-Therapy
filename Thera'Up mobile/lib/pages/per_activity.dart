import 'package:flutter/material.dart';
import 'dart:async';
import 'package:http/http.dart' as http;
import 'dart:convert';

class PerActivity extends StatefulWidget {
  final String activityName;
  final double allocatedTime;
  final String location;
  final String activityId; // Add this line

  const PerActivity({
    super.key,
    required this.activityName,
    required this.allocatedTime,
    required this.location,
    required this.activityId, // Add this
  });

  @override
  _PerActivityState createState() => _PerActivityState();
}


class _PerActivityState extends State<PerActivity> {
  Timer? _timer;
  late int _totalSeconds;
  int _remainingSeconds = 0;
  bool _isRunning = false;
  bool _isPaused = false;

  final String activityId = "ACT001"; // Replace this with a dynamic value if needed
  final String patientId = "1"; // Hardcoded as per your instruction

  @override
  void initState() {
    super.initState();
    _totalSeconds = (widget.allocatedTime * 60).toInt();
    _remainingSeconds = _totalSeconds;
  }

  void _startTimer() {
    if (!_isRunning) {
      setState(() {
        _isRunning = true;
        _isPaused = false;
      });
      _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
        if (_remainingSeconds > 0) {
          setState(() {
            _remainingSeconds--;
          });
        } else {
          _stopTimer();
        }
      });
    }
  }

  void _pauseTimer() {
    if (_isRunning) {
      setState(() {
        _isRunning = false;
        _isPaused = true;
      });
      _timer?.cancel();
    }
  }

  Future<void> _stopTimer() async {
    if (_isRunning || _isPaused) {
      setState(() {
        _isRunning = false;
        _isPaused = false;
      });
      _timer?.cancel();
      await _updateRemainingTimeToServer();
    }
  }

  Future<void> _updateRemainingTimeToServer() async {
    final url = Uri.parse("https://theraupbackend.pixelcore.lk/api/v1/theraup/postTherapy/updateRemainingTime");

    try {
      final response = await http.put(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "patient_id": patientId,
          "activity_id": widget.activityId,
          "remaining_time": _remainingSeconds ~/ 60,

        }),
      );

      if (response.statusCode == 200) {
        print("Successfully updated remaining time.");
      } else {
        print("Failed to update time. Status: ${response.statusCode}");
      }
    } catch (e) {
      print("Error sending update: $e");
    }
  }

  String _formatTime(int seconds) {
    final int minutes = seconds ~/ 60;
    final int remainingSeconds = seconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${remainingSeconds.toString().padLeft(2, '0')}';
  }

  double _progressPercentage() {
    return _totalSeconds == 0 ? 0 : _remainingSeconds / _totalSeconds;
  }

  @override
  Widget build(BuildContext context) {
    final Color primaryColor = Color(0xFF448aff);
    final Color lightColor = primaryColor.withOpacity(0.2);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.activityName,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: primaryColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Stack(
              alignment: Alignment.center,
              children: [
                SizedBox(
                  height: 200,
                  width: 200,
                  child: CircularProgressIndicator(
                    value: 1 - _progressPercentage(),
                    strokeWidth: 12,
                    backgroundColor: lightColor,
                    valueColor: AlwaysStoppedAnimation<Color>(primaryColor),
                  ),
                ),
                Text(
                  _formatTime(_remainingSeconds),
                  style: const TextStyle(
                    fontSize: 36,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 40),
            Text(
              "Location: ${widget.location}",
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Text(
              "Allocated Time: ${widget.allocatedTime.toStringAsFixed(0)} minutes",
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 40),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: _startTimer,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: primaryColor,
                    padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                  ),
                  child: const Text(
                    "Start",
                    style: TextStyle(fontSize: 16, color: Colors.white),
                  ),
                ),
                const SizedBox(width: 20),
                ElevatedButton(
                  onPressed: _pauseTimer,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange,
                    padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                  ),
                  child: const Text(
                    "Pause",
                    style: TextStyle(fontSize: 16, color: Colors.white),
                  ),
                ),
                const SizedBox(width: 20),
                ElevatedButton(
                  onPressed: _stopTimer,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.redAccent,
                    padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                  ),
                  child: const Text(
                    "Stop",
                    style: TextStyle(fontSize: 16, color: Colors.white),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
