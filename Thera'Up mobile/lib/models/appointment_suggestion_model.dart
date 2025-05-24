import 'package:thera_up/models/TherapySession.dart';

class AppointmentSuggestionsModel {
  final String sessionId;
  final String doctorName;
  final String image;
  final String designation;
  final String rating;
  final String date;
  final String time;
  final String price;
  final String duration;
  final Doctor doctor; // Add this field
  final String experience; // Add this field

  AppointmentSuggestionsModel({
    required this.sessionId,
    required this.doctorName,
    required this.image,
    required this.designation,
    required this.rating,
    required this.date,
    required this.time,
    required this.price,
    required this.duration,
    required this.doctor, // Add this field
    required this.experience, // Add this field
  });

  // Factory constructor to map TherapySession to AppointmentSuggestionsModel
  factory AppointmentSuggestionsModel.fromTherapySession(TherapySession session) {
    return AppointmentSuggestionsModel(
      sessionId: session.sessionId,
      doctorName: session.doctor.fullName ?? 'Unknown Doctor',
      image: _getDoctorImage(session.doctor.id), // Use a function to get the image URL
      designation: session.doctor.qualification ?? 'Unknown Qualification',
      rating: session.rating?.toString() ?? '0.0',
      date: session.date ?? 'Unknown Date',
      time: session.time ?? 'Unknown Time',
      price: '\$${session.doctor.ratePerHour ?? '0'}',
      duration: '${session.sessionDuration ?? 0} Minutes',
      doctor: session.doctor, // Add this field
      experience: '${session.exprerience ?? 0} Years', // Add this field
    );
  }

  // Helper function to get doctor image (you can customize this)
  static String _getDoctorImage(int doctorId) {
    // Replace with your logic to fetch doctor images
    return 'https://static-00.iconduck.com/assets.00/im-user-online-icon-242x256-6bbvmx3a.png'; // Placeholder image
  }
}