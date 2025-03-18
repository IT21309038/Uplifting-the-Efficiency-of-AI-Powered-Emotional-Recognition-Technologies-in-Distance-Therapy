import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:thera_up/pages/login.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Profile extends StatelessWidget {
  const Profile({Key? key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar:  appBar(),
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            SizedBox(height: 20),
            // Profile Circle
            CircleAvatar(
              radius: 50,
              backgroundColor: Colors.grey[200],
              child: Text(
                "JS", // Initials
                style: TextStyle(
                  fontSize: 32,
                  color: Colors.purple,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            SizedBox(height: 20),
            // User Name and Joined Date
            Text(
              "Zain Malik",
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w600,
                color: Colors.black,
              ),
            ),
            SizedBox(height: 5),
            Text(
              "Joined August 17, 2023",
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey,
              ),
            ),
            SizedBox(height: 30),
            // General Information Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.1),
                      spreadRadius: 1,
                      blurRadius: 10,
                      offset: Offset(0, 1),
                    ),
                  ],
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Card(
                  color: Colors.white,
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 20.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // General Header
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20.0),
                          child: Text(
                            "General",
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: Colors.black,
                            ),
                          ),
                        ),
                        SizedBox(height: 20),
                        // Profile Details
                        ListTile(
                          leading: SvgPicture.asset('assets/icons/user.svg'),
                          title: Text(
                            "Zain Malik",
                            style: TextStyle(fontSize: 16, color: Colors.black),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20.0),
                          child: Divider(),
                        ),
                        ListTile(
                          leading: SvgPicture.asset('assets/icons/email.svg'),
                          title: Text(
                            "zainmalik02323@gmail.com",
                            style: TextStyle(fontSize: 16, color: Colors.black),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20.0),
                          child: Divider(),
                        ),
                        ListTile(
                          leading: SvgPicture.asset('assets/icons/phone.svg'),
                          title: Text(
                            "071 123 4567",
                            style: TextStyle(fontSize: 16, color: Colors.black),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20.0),
                          child: Divider(),
                        ),
                        ListTile(
                          leading: SvgPicture.asset('assets/icons/cake.svg'),
                          title: Text(
                            "Birthday: 17 August 1995",
                            style: TextStyle(fontSize: 16, color: Colors.black),
                          ),
                          onTap: () {
                            // Add feedback functionality here
                          },
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            SizedBox(height: 30),
            //Settings Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.1),
                      spreadRadius: 1,
                      blurRadius: 10,
                      offset: Offset(0, 1),
                    ),
                  ],
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Card(
                  color: Colors.white,
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 20.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // General Header
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20.0),
                          child: Text(
                            "Settings",
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: Colors.black,
                            ),
                          ),
                        ),
                        SizedBox(height: 20),
                        // Profile Details
                        ListTile(
                          leading: SvgPicture.asset('assets/icons/lock-reset.svg'),
                          title: Text(
                            "Change Password",
                            style: TextStyle(fontSize: 16, color: Colors.black),
                          ),
                          onTap: () {
                            _showChangePasswordDialog(context);
                          },
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20.0),
                          child: Divider(),
                        ),
                        ListTile(
                          leading: SvgPicture.asset('assets/icons/delete.svg'),
                          title: Text(
                            "Delete Account",
                            style: TextStyle(fontSize: 16, color: Colors.black),
                          ),
                          onTap: () {
                            _showDeleteAccountDialog(context);
                          },
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            SizedBox(height: 30),
            // Sign Out Button
            TextButton(
              onPressed: () async {
                await Profile(); // Clear session before navigating
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const Login()),
                );
              },
              style: TextButton.styleFrom(
                backgroundColor: Colors.red[500],
                minimumSize: const Size(200, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(25),
                ),
              ),
              child: const Text(
                "Sign out",
                style: TextStyle(fontSize: 16, color: Colors.white),
              ),
            ),
            SizedBox(height: 20),
            // Version Info and Links
            Column(
              children: [
                Text(
                  "Version 1.0.0",
                  style: TextStyle(fontSize: 14, color: Colors.grey),
                ),
                SizedBox(height: 5),
                Text(
                  "©2024 all rights reserved",
                  style: TextStyle(fontSize: 14, color: Colors.grey),
                ),
                SizedBox(height: 5),
              ],
            ),
            SizedBox(height: 30),
          ],
        ),
      ),
    );
  }


  AppBar appBar(){
    return AppBar(
      centerTitle: true,
      title: Text('Profile Page',
        style: TextStyle(
          color: Colors.black,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),),
      automaticallyImplyLeading: false,
      backgroundColor: Colors.white,
      elevation: 0,
    );
  }


  void _showChangePasswordDialog(BuildContext context) {
    final TextEditingController oldPasswordController =
    TextEditingController();
    final TextEditingController newPasswordController =
    TextEditingController();
    final TextEditingController confirmPasswordController =
    TextEditingController();

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(
            "Change Password",
            style: TextStyle(fontWeight: FontWeight.w600, fontSize: 20),
          ),
          content: Container(
            width: 300,
            height: 250,
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: 25),
                  TextField(
                    controller: oldPasswordController,
                    obscureText: true,
                    decoration: InputDecoration(
                      labelText: "Old Password",
                      border: OutlineInputBorder(),
                    ),
                  ),
                  SizedBox(height: 20),
                  TextField(
                    controller: newPasswordController,
                    obscureText: true,
                    decoration: InputDecoration(
                      labelText: "New Password",
                      border: OutlineInputBorder(),
                    ),
                  ),
                  SizedBox(height: 20),
                  TextField(
                    controller: confirmPasswordController,
                    obscureText: true,
                    decoration: InputDecoration(
                      labelText: "Re-enter New Password",
                      border: OutlineInputBorder(),
                    ),
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
              },
              child: Text("Cancel"),
            ),
            ElevatedButton(
              onPressed: () {
                // Validate Passwords
                String oldPassword = oldPasswordController.text;
                String newPassword = newPasswordController.text;
                String confirmPassword = confirmPasswordController.text;

                if (oldPassword.isEmpty ||
                    newPassword.isEmpty ||
                    confirmPassword.isEmpty) {
                  _showMessage(context, "All fields are required!");
                  return;
                }

                if (newPassword != confirmPassword) {
                  _showMessage(context, "New passwords do not match!");
                  return;
                }

                if (newPassword.length < 6) {
                  _showMessage(
                      context, "Password must be at least 6 characters long!");
                  return;
                }

                // Perform the password change logic here
                // e.g., Call an API or update local storage

                Navigator.of(context).pop(); // Close the dialog
                _showMessage(context, "Password changed successfully!");
              },
              child: Text("Submit"),
            ),
          ],
        );
      },
    );
  }

  void _showMessage(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: Duration(seconds: 2),
      ),
    );
  }


  void _showDeleteAccountDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text("Delete Account"),
          content: Text("Are you sure you want to delete your account? This action cannot be undone."),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
              },
              child: Text("Cancel"),
            ),
            ElevatedButton(
              onPressed: () {
                // Perform the account deletion logic here
                // e.g., Call an API or update local storage

                Navigator.of(context).pop(); // Close the dialog
                _showMessage(context, "Account deleted successfully!");
              },
              child: Text("Delete",
                style: TextStyle(
                  color: Colors.white, // Text color
                  fontSize: 16, // Text size
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red.withOpacity(0.7), // Button color
              ),
            ),
          ],
        );
      },
    );
  }
}