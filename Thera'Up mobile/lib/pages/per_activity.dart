import 'package:flutter/material.dart';
import 'dart:async';

class PerActivity extends StatefulWidget {
  final String activityName;
  final double allocatedTime; // Time in hours
  final String location;

  const PerActivity({
    Key? key,
    required this.activityName,
    required this.allocatedTime,
    required this.location,
  }) : super(key: key);

  @override
  _PerActivityState createState() => _PerActivityState();
}

class _PerActivityState extends State<PerActivity> {
  Timer? _timer;
  late int _totalSeconds;
  int _remainingSeconds = 0;
  bool _isRunning = false;

  @override
  void initState() {
    super.initState();
    _totalSeconds = (widget.allocatedTime * 3600).toInt(); // Convert hours to seconds
    _remainingSeconds = _totalSeconds;
  }

  void _startTimer() {
    if (!_isRunning) {
      setState(() {
        _isRunning = true;
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

  void _stopTimer() {
    if (_isRunning) {
      setState(() {
        _isRunning = false;
      });
      _timer?.cancel();
    }
  }

  void _resetTimer() {
    setState(() {
      _remainingSeconds = _totalSeconds;
      _stopTimer();
    });
  }

  String _formatTime(int seconds) {
    final int minutes = seconds ~/ 60;
    final int remainingSeconds = seconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${remainingSeconds.toString().padLeft(2, '0')}';
  }

  double _progressPercentage() {
    return _remainingSeconds / _totalSeconds;
  }

  @override
  Widget build(BuildContext context) {
    final Color primaryColor = Color(0xFF448aff);
    final Color accentColor = primaryColor.withOpacity(0.8);
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
            // Circular Timer
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
              "Allocated Time: ${widget.allocatedTime.toStringAsFixed(1)} hours",
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
            )
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