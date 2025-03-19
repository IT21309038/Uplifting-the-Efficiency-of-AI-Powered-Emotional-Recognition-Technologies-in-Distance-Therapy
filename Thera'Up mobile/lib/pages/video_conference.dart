// import 'package:flutter/material.dart';
// import 'package:jitsi_meet_flutter_sdk/jitsi_meet_flutter_sdk.dart';
//
// class VideoConferencePage extends StatefulWidget {
//   @override
//   _VideoConferencePageState createState() => _VideoConferencePageState();
// }
//
// class _VideoConferencePageState extends State<VideoConferencePage> {
//   final TextEditingController _roomController = TextEditingController();
//   final TextEditingController _nameController = TextEditingController();
//   late JitsiMeet _jitsiMeet;
//
//   bool isAudioMuted = false;
//   bool isVideoMuted = false;
//
//   @override
//   void initState() {
//     super.initState();
//     _jitsiMeet = JitsiMeet();
//   }
//
//   Future<void> _joinMeeting() async {
//     try {
//       String roomName = _roomController.text.trim();
//       String userName = _nameController.text.trim().isEmpty ? "Guest" : _nameController.text.trim();
//
//       var options = JitsiMeetConferenceOptions(
//         // serverURL: "https://meetings.pixelcore.lk/",
//         serverURL: "https://meet.jit.si/",
//         room: roomName,
//         userInfo: JitsiMeetUserInfo(
//           displayName: userName,
//         ),
//         configOverrides: {
//           "startWithAudioMuted": isAudioMuted,
//           "startWithVideoMuted": isVideoMuted,
//         },
//       );
//
//       await _jitsiMeet.join(options);
//     } catch (error) {
//       print("Error: $error");
//     }
//   }
//
//   @override
//   void dispose() {
//     _jitsiMeet.hangUp();
//     super.dispose();
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: Text("Jitsi Video Conference")),
//       body: Padding(
//         padding: const EdgeInsets.all(20.0),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             Text("Enter Meeting ID:", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
//             TextField(
//               controller: _roomController,
//               decoration: InputDecoration(hintText: "e.g. my-meeting-room"),
//             ),
//             SizedBox(height: 15),
//             Text("Your Name:", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
//             TextField(
//               controller: _nameController,
//               decoration: InputDecoration(hintText: "e.g. John Doe"),
//             ),
//             SizedBox(height: 15),
//             Row(
//               children: [
//                 Checkbox(
//                   value: isAudioMuted,
//                   onChanged: (value) {
//                     setState(() {
//                       isAudioMuted = value!;
//                     });
//                   },
//                 ),
//                 Text("Mute Audio"),
//                 Spacer(),
//                 Checkbox(
//                   value: isVideoMuted,
//                   onChanged: (value) {
//                     setState(() {
//                       isVideoMuted = value!;
//                     });
//                   },
//                 ),
//                 Text("Mute Video"),
//               ],
//             ),
//             SizedBox(height: 20),
//             Center(
//               child: ElevatedButton(
//                 onPressed: (){
//                   Navigator.pop(context);
//                   _joinMeeting();
//                 } ,
//                 style: ElevatedButton.styleFrom(
//                   backgroundColor: Colors.blueAccent,
//                   padding: EdgeInsets.symmetric(horizontal: 40, vertical: 12),
//                 ),
//                 child: Text("Join Meeting", style: TextStyle(fontSize: 18, color: Colors.white)),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }
