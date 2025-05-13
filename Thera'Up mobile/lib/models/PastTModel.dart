class PastTModel {
  String date;
  String duration;
  String therapist;
  String rating;
  String status;

  PastTModel({
    required this.date,
    required this.duration,
    required this.therapist,
    required this.rating,
    required this.status,
  });

  factory PastTModel.fromJson(Map<String, dynamic> json) {
    return PastTModel(
      date: json['date'],
      duration: '${json['sessionDuration']} Mins',
      therapist: json['doctor']['full_name'],
      rating: json['rating']?.toString() ?? '',
      status: json['status'],
    );
  }
}