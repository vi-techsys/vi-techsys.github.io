var rtc = {
    // For the local client.
    client: null,
    // For the local audio track.
    localAudioTrack: null,
  };
  
  var options = {
    // Pass your app ID here.
    appId: "f8560fa917154f40b69e09330da4b538",
    // Set the channel name.
    channel: "my_channel",
    // Pass a token if your project enables the App Certificate.
    token: null,
  };
  
  async function startBasicCall() {
    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    const uid = await rtc.client.join(options.appId, options.channel, options.token, null);
    // Create an audio track from the audio sampled by a microphone.
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // Publish the local audio track to the channel.
    await rtc.client.publish([rtc.localAudioTrack]);

    console.log("publish success!");
    rtc.client.on("user-published", async (user, mediaType) => {
        // Subscribe to a remote user.
        await rtc.client.subscribe(user, mediaType);
        console.log("subscribe success");
        console.log("User-" + user);
        // If the subscribed track is audio.
        if (mediaType === "audio") {
          // Get `RemoteAudioTrack` in the `user` object.
          const remoteAudioTrack = user.audioTrack;
          // Play the audio track. No need to pass any DOM element.
          remoteAudioTrack.play();
        }
      });
      rtc.client.on("user-unpublished", user => {
        // Get the dynamically created DIV container.
        const playerContainer = document.getElementById(user.uid);
        // Destroy the container.
        playerContainer.remove();
      });
      document.querySelector("#start").setAttribute("disabled", "disabled");
      document.querySelector("#stop").removeAttribute("disabled");
  }
  
  async function leaveCall() {
    // Destroy the local audio and track.
    rtc.localAudioTrack.close();
  
    // Leave the channel.
    await rtc.client.leave();
    document.querySelector("#stop").setAttribute("disabled", "disabled");
      document.querySelector("#start").removeAttribute("disabled");
  }