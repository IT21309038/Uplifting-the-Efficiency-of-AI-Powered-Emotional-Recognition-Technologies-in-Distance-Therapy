class UpCommingTModel {
  String sessionId;
  String date;
  String time;
  String duration;
  String therapist;
  bool paid;
  int sessionDuration;

  UpCommingTModel({
    required this.sessionId,
    required this.date,
    required this.time,
    required this.duration,
    required this.therapist,
    required this.paid,
    required this.sessionDuration,
  });

  // Factory constructor to map API data
  factory UpCommingTModel.fromJson(Map<String, dynamic> json) {
    return UpCommingTModel(
      sessionId: json['session_id'],
      date: json['date'],
      time: json['time'],
      duration: '${json['sessionDuration']} Mins',
      therapist: json['doctor']['full_name'],
      paid: json['paymentStatus'] == 'paid',
      sessionDuration: json['sessionDuration'],
    );
  }
}