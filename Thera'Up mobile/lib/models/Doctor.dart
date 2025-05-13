class Doctor {
  final int id;
  final String fullName;
  final String qualification;
  final double ratePerHour;
  final int experience; // Add this field

  Doctor({
    required this.id,
    required this.fullName,
    required this.qualification,
    required this.ratePerHour,
    required this.experience, // Add this field
  });

  // Factory constructor to parse JSON data
  factory Doctor.fromJson(Map<String, dynamic> json) {
    return Doctor(
      id: json['id'] ?? 0,
      fullName: json['full_name'] ?? 'Unknown Doctor',
      qualification: json['qualification'] ?? 'Unknown Qualification',
      ratePerHour: json['rate_per_hour']?.toDouble() ?? 0.0,
      experience: json['experience'] ?? 0, // Add this field
    );
  }
}