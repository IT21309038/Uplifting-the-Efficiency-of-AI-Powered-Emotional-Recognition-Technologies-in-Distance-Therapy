class UpCommingTModel {
  String date;
  String time;
  String duration;
  String therapist;
  bool paid;

  UpCommingTModel({
    required this.date,
    required this.time,
    required this.duration,
    required this.therapist,
    required this.paid,
  });

  // Factory constructor to map API data
  factory UpCommingTModel.fromJson(Map<String, dynamic> json) {
    return UpCommingTModel(
      date: json['date'],
      time: json['time'],
      duration: '${json['sessionDuration']} Mins',
      therapist: json['doctor']['full_name'],
      paid: json['paymentStatus'] == 'paid',
    );
  }
}