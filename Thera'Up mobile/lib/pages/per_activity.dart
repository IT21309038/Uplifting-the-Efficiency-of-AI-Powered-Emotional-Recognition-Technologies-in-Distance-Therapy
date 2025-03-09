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
    final Color primaryColor = Color(0xFFe1f0ff);
    final Color accentColor = Colors.blueAccent;
    final TextStyle labelStyle = TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: accentColor);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.activityName,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: accentColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            AnimatedOpacity(
              opacity: 1.0,
              duration: Duration(milliseconds: 300),
              child: Card(
                color: primaryColor,
                elevation: 10,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("Location:", style: labelStyle),
                      Text(widget.location, style: TextStyle(fontSize: 18)),
                      const SizedBox(height: 20),
                      Text("Allocated Time:", style: labelStyle),
                      Text("${widget.allocatedTime.toStringAsFixed(1)} hours", style: TextStyle(fontSize: 18)),
                      const SizedBox(height: 20),
                      Text("Elapsed Time:", style: labelStyle),
                      Text("${_formatTime(_totalSeconds - _remainingSeconds)} elapsed", style: TextStyle(fontSize: 18)),
                      const SizedBox(height: 20),
                      Text("Remaining Time:", style: labelStyle),
                      Center(
                        child: Text(
                          _formatTime(_remainingSeconds),
                          style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Colors.redAccent),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 30),
            AnimatedOpacity(
              opacity: 1.0,
              duration: Duration(milliseconds: 300),
              child: Card(
                elevation: 5,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        "Progress: ${(100 * (1 - _progressPercentage())).toStringAsFixed(1)}% completed",
                        style: TextStyle(fontSize: 16, color: accentColor),
                      ),
                      const SizedBox(height: 10),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: LinearProgressIndicator(
                          value: _progressPercentage(),
                          backgroundColor: Colors.grey[300],
                          color: accentColor,
                          minHeight: 10,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 30),
            Center(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton(
                    onPressed: _startTimer,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15),
                      ),
                    ),
                    child: const Text(
                      "Start",
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                  const SizedBox(width: 20),
                  ElevatedButton(
                    onPressed: _stopTimer,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15),
                      ),
                    ),
                    child: const Text(
                      "Stop",
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                  const SizedBox(width: 20),
                  ElevatedButton(
                    onPressed: _resetTimer,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: accentColor,
                      padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15),
                      ),
                    ),
                    child: const Text(
                      "Reset",
                      style: TextStyle(fontSize: 16),
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

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
