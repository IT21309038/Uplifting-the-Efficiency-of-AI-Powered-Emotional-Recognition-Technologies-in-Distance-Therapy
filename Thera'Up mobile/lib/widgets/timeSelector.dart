import 'package:flutter/material.dart';

class TimeSlotSelector extends StatefulWidget {
  @override
  _TimeSlotSelectorState createState() => _TimeSlotSelectorState();
}

class _TimeSlotSelectorState extends State<TimeSlotSelector> {
  String? selectedTimeSlot = "07:00 PM";

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: Colors.grey[300]!),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          SizedBox(height: 20),
          Wrap(
            spacing: 8.0,
            runSpacing: 8.0,
            children: [
              _buildTimeSlot("06:00 PM", isDisabled: true),
              _buildTimeSlot("06:30 PM"),
              _buildTimeSlot("07:00 PM"),
              _buildTimeSlot("07:30 PM"),
              _buildTimeSlot("08:00 PM", isDisabled: true),
              _buildTimeSlot("08:30 PM"),
              _buildTimeSlot("09:00 PM"),
              _buildTimeSlot("10:00 PM"),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTimeSlot(String time, {bool isDisabled = false}) {
    bool isSelected = selectedTimeSlot == time;
    return GestureDetector(
      onTap: isDisabled
          ? null
          : () {
        setState(() {
          selectedTimeSlot = time;
        });
      },
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isDisabled
              ? Colors.grey[400]
              : isSelected
              ? Color(0xff9DCEFF)
              : Colors.grey[200],
          borderRadius: BorderRadius.circular(8),
          border: isSelected
              ? Border.all(color: Color(0xff9DCEFF), width: 1.5)
              : Border.all(color: Colors.grey[300]!),
        ),
        child: Text(
          time,
          style: TextStyle(
            color: isDisabled
                ? Colors.grey[600]
                : isSelected
                ? Colors.white
                : Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}