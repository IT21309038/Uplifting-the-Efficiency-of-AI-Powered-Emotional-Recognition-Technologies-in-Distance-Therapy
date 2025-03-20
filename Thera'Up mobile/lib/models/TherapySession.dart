class TherapySession {
  final String sessionId;
  final Doctor doctor;
  final String date;
  final String time;
  final int sessionDuration;
  final double? rating;
  final String status;
  final String paymentStatus;
  final String exprerience;

  TherapySession({
    required this.sessionId,
    required this.doctor,
    required this.date,
    required this.time,
    required this.sessionDuration,
    this.rating,
    required this.status,
    required this.paymentStatus,
    required this.exprerience,
  });

  // Factory constructor to parse JSON data
  factory TherapySession.fromJson(Map<String, dynamic> json) {
    return TherapySession(
      sessionId: json['session_id'] ?? 'Unknown Session ID',
      doctor: Doctor.fromJson(json['doctor']),
      date: json['date'] ?? 'Unknown Date',
      time: json['time'] ?? 'Unknown Time',
      sessionDuration: json['sessionDuration'] ?? 0,
      rating: json['rating']?.toDouble(),
      status: json['status'] ?? 'Unknown Status',
      paymentStatus: json['paymentStatus'] ?? 'Unknown Payment Status',
      exprerience: json['experience'] ?? 'Unknown Experience',
    );
  }
}

class Doctor {
  final int id;
  final String fullName;
  final String qualification;
  final double ratePerHour;

  Doctor({
    required this.id,
    required this.fullName,
    required this.qualification,
    required this.ratePerHour,
  });

  // Factory constructor to parse JSON data
  factory Doctor.fromJson(Map<String, dynamic> json) {
    return Doctor(
      id: json['id'] ?? 0,
      fullName: json['full_name'] ?? 'Unknown Doctor',
      qualification: json['qualification'] ?? 'Unknown Qualification',
      ratePerHour: json['rate_per_hour']?.toDouble() ?? 0.0,
    );
  }
}