import 'dart:async';
import 'dart:developer' as console;
import 'package:agora_rtc_engine/agora_rtc_engine.dart';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:thera_up/pages/therapy.dart';

void main() => runApp(const MyApp());

// Fill in the app ID obtained from Agora Console
const appId = "b62636e82bae4d77a10929859b2d798f";
// Fill in the temporary token generated from Agora Console
const token = "<-- Insert token -->";
// Fill in the channel name you used to generate the token
const channel = "TEST-001";

// Main App Widget
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: MainScreen(),
    );
  }
}

// Video Call Screen Widget
class MainScreen extends StatefulWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  _MainScreenScreenState createState() => _MainScreenScreenState();
}

class _MainScreenScreenState extends State<MainScreen> {
  int? _remoteUid; // Stores remote user ID
  bool _localUserJoined =
      false; // Indicates if local user has joined the channel
  late RtcEngine _engine; // Stores Agora RTC Engine instance

  @override
  void initState() {
    super.initState();
    _startVideoCalling();
  }

  // Initializes Agora SDK
  Future<void> _startVideoCalling() async {
    await _requestPermissions();
    await _initializeAgoraVideoSDK();
    await _setupLocalVideo();
    _setupEventHandlers();
    await _joinChannel();
  }

  // Requests microphone and camera permissions
  Future<void> _requestPermissions() async {
    await [Permission.microphone, Permission.camera].request();
  }

  // Set up the Agora RTC engine instance
  Future<void> _initializeAgoraVideoSDK() async {
    _engine = createAgoraRtcEngine();
    await _engine.initialize(const RtcEngineContext(
      appId: appId,
      channelProfile: ChannelProfileType.channelProfileCommunication,
    ));

    // 🔹 Force Video Encoder Config to Use H264
    await _engine.setVideoEncoderConfiguration(
      const VideoEncoderConfiguration(
        codecType: VideoCodecType.videoCodecH264, // ✅ Force H264 Codec
        dimensions: VideoDimensions(width: 1280, height: 720), // 720p
        frameRate: 30,
        bitrate: 0, // Auto Bitrate
      ),
    );
  }

  // Enables and starts local video preview
  Future<void> _setupLocalVideo() async {
    await _engine.enableVideo();
    await _engine.startPreview();
  }

  // Register an event handler for Agora RTC
  void _setupEventHandlers() {
    _engine.registerEventHandler(
      RtcEngineEventHandler(
        onJoinChannelSuccess: (RtcConnection connection, int elapsed) {
          debugPrint("Local user ${connection.localUid} joined");
          setState(() => _localUserJoined = true);
        },
        onUserJoined: (RtcConnection connection, int remoteUid, int elapsed) {
          debugPrint("Remote user $remoteUid joined");
          setState(() => _remoteUid = remoteUid);
        },
        onUserOffline: (RtcConnection connection, int remoteUid,
            UserOfflineReasonType reason) {
          debugPrint("Remote user $remoteUid left");
          setState(() => _remoteUid = null);
        },
      ),
    );
  }

  // Join a channel
  Future<void> _joinChannel() async {
    await _engine.joinChannel(
      token: "",
      channelId: channel,
      options: const ChannelMediaOptions(
        autoSubscribeVideo: true,
        autoSubscribeAudio: true,
        publishCameraTrack: true,
        publishMicrophoneTrack: true,
        clientRoleType: ClientRoleType.clientRoleBroadcaster,
      ),
      uid: 0,
    );
  }

  // Leave the channel
  Future<void> _leaveMeeting() async {
    await _engine.leaveChannel();
    await _engine.release();
    //go to a specific page after leaving the meeting therapy.dart
    console.log("Leaving the meeting");
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (ctext) => Therapy()),
    );
  }

  @override
  void dispose() {
    _cleanupAgoraEngine();
    super.dispose();
  }

  // Leaves the channel and releases resources
  Future<void> _cleanupAgoraEngine() async {
    await _engine.leaveChannel();
    await _engine.release();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Agora Video Calling'),
        actions: [
          IconButton(
            icon: const Icon(Icons.exit_to_app),
            onPressed: _leaveMeeting,
          ),
        ],
      ),
      body: Stack(
        children: [
          Center(child: _remoteVideo()),
          Align(
            alignment: Alignment.topLeft,
            child: SizedBox(
              width: 100,
              height: 150,
              child: Center(
                child: _localUserJoined
                    ? _localVideo()
                    : const CircularProgressIndicator(),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Displays remote video view
  Widget _localVideo() {
    return AgoraVideoView(
      controller: VideoViewController(
        rtcEngine: _engine,
        canvas: const VideoCanvas(
          uid: 0,
          renderMode: RenderModeType.renderModeHidden,
        ),
      ),
    );
  }

  // Displays remote video view
  Widget _remoteVideo() {
    if (_remoteUid != null) {
      return AgoraVideoView(
        controller: VideoViewController.remote(
          rtcEngine: _engine,
          canvas: VideoCanvas(uid: _remoteUid),
          connection: const RtcConnection(channelId: channel),
        ),
      );
    } else {
      return const Text(
        'Waiting for remote user to join...',
        textAlign: TextAlign.center,
      );
    }
  }
}
