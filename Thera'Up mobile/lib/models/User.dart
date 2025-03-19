class User {
  final int id;
  final String fullName;
  final String email;
  final String gender;
  final String phone;
  final String dob;
  final String role;
  final String joinedAt;

  User({
    required this.id,
    required this.fullName,
    required this.email,
    required this.gender,
    required this.phone,
    required this.dob,
    required this.role,
    required this.joinedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      fullName: json['full_name'],
      email: json['email'],
      gender: json['gender'],
      phone: json['phone'],
      dob: json['dob'],
      role: json['role']['role_name'],
      joinedAt: json['joined_at'],
    );
  }
}
