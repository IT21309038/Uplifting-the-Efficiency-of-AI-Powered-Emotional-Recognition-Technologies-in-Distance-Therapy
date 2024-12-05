import 'package:flutter/material.dart';

class PastTModel{
  String date;
  String duration;
  String therapist;
  String rating;
  String status;

  PastTModel({required this.date, required this.duration, required this.therapist, required this.rating, required this.status});

  static List<PastTModel> getPastT(){
    List<PastTModel> pastT = [];

    pastT.add(PastTModel(date: 'Monday, 12 July 2021', duration: '30 Mins', therapist: 'Dr. John Doe', rating: '', status: 'Ongoing'));
    pastT.add(PastTModel(date: 'Tuesday, 13 July 2021', duration: '30 Mins', therapist: 'Dr. John Doe', rating: '4', status: 'Completed'));
    pastT.add(PastTModel(date: 'Wednesday, 14 July 2021', duration: '30 Mins', therapist: 'Dr. John Doe', rating: '3.0', status: 'Not completed'));
    pastT.add(PastTModel(date: 'Thursday, 15 July 2021', duration: '30 Mins', therapist: 'Dr. John Doe', rating: '5', status: 'N/A'));

    return pastT;
  }
}