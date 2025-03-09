import 'package:flutter/material.dart';

class AppointmentSuggestionsModel {
  String doctorName;
  String image;
  String designation;
  String rating;
  String Date;
  String time;
  String price;
  String duration;

  AppointmentSuggestionsModel({required this.doctorName, required this.image, required this.designation, required this.rating, required this.Date, required this.time, required this.price, required this.duration});

  static List<AppointmentSuggestionsModel> getAppointmentSuggestionsModel(){
    List<AppointmentSuggestionsModel> appointmentSuggestions = [];

    appointmentSuggestions.add(AppointmentSuggestionsModel(doctorName: 'Dr. Priya Gamage',image: 'https://media.istockphoto.com/id/1395128697/photo/psychologist-session.jpg?s=612x612&w=0&k=20&c=VL2uUVLzrb8VW6WiT-nyvoM3GkZE8kDicDen4uP-MJ0=', designation: 'Clinical Psychologists', rating: '4.5', Date: '12 December 2024', time: '5:00 PM', price: '\$75', duration: '1 Hour'));
    appointmentSuggestions.add(AppointmentSuggestionsModel(doctorName: 'Dr. Ashen Pradeep',image: 'https://www.shutterstock.com/image-photo/young-arab-man-psychologist-talking-260nw-2298406395.jpg', designation: 'Counselors', rating: '4.2', Date: '12 December 2025', time: '7:00 PM', price: '\$100', duration: '1 Hour'));
    appointmentSuggestions.add(AppointmentSuggestionsModel(doctorName: 'Dr. Nimali Karunarathna',image: 'https://t4.ftcdn.net/jpg/04/96/79/09/360_F_496790950_JxUvnh6hkvmi0KB17xCLDvQngrAa26MZ.jpg', designation: 'Behavioral Therapists', rating: '4.6', Date: '12 December 2025', time: '6:00 PM', price: '\$90', duration: '1 Hour'));

    return appointmentSuggestions;
  }
}