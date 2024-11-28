import 'package:flutter/material.dart';

class UpCommingTModel {
  String date;
  String time;
  String duration;
  String therapist;
  bool paid;

  UpCommingTModel({required this.date, required this.time, required this.duration, required this.therapist, required this.paid});

  static List<UpCommingTModel> getUpCommingT(){
    List<UpCommingTModel> upCommingT = [];

    upCommingT.add(UpCommingTModel(date: 'Monday, 12 July 2021', time: '10:00 AM', duration: '30 Mins', therapist: 'Dr. John Doe', paid: true));
    upCommingT.add(UpCommingTModel(date: 'Tuesday, 13 July 2021', time: '11:00 AM', duration: '30 Mins', therapist: 'Dr. John Doe', paid: false));
    upCommingT.add(UpCommingTModel(date: 'Wednesday, 14 July 2021', time: '12:00 PM', duration: '30 Mins', therapist: 'Dr. John Doe', paid: true));
    upCommingT.add(UpCommingTModel(date: 'Thursday, 15 July 2021', time: '01:00 PM', duration: '30 Mins', therapist: 'Dr. John Doe', paid: false));

    return upCommingT;
  }
}