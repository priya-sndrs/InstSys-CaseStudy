import React, { useEffect, useRef } from "react";

export default function VoiceInput({ setInput, micON }) {
  const micStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const gainNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  /*
   So as the file name itself, this is the voice input Module. Now to further explain this code:
   -So we have a micON state that is passsed from the parent component which is yung aiChat.jsx
   -We then ask for browsers media permission sepecifically the microphone lang, then we store that as "stream"
   -That stream is like metadata lang ng audio, not the whole media itself
   -Then we store that to adioContextRef which is the main controller of all things audio
   Think of it as like sound studio you have this huge board with all the audio related stuff, So thats basically audioContext
   We took the stream then manipulate it using audioContext
   Moving on to the source, gainNode, analyser
   -Source is like the input, so we create a source from the stream
   -GainNode is like volume control, we set it to 1.0 which is normal volume
   -Analyser is like a visualizer, it gives us data about the audio frequencies
   We connect them all together, source to gainNode to analyser to destination (which is the speakers)
   Then we create a data array to hold the frequency data
   We then have a function detectVoice that continuously checks the audio data
   If the average frequency is above a certain threshold (30 in this case), we log that voice is detected
   Finally we have cleanup code to stop the mic and disconnect everything when micON is false or component unmounts
  */

  useEffect(() => {
    console.log("micON changed:", micON);

    const startListening = async () => {
      try {
        // 1. Access microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;

        // 2. Media or Audio environment whatever you wanna call it
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;

        // 3. This is like the audio board where you create different nodes
        const source = audioContext.createMediaStreamSource(stream);
        const gainNode = audioContext.createGain();
        const analyser = audioContext.createAnalyser();

        // Random stuff for the analyser edits frequence and volume stuff
        analyser.fftSize = 2048;
        gainNode.gain.value = 1.0;

        // 4. Connect them nodes together
        source.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(audioContext.destination); // This is the one that connect the audio to speaker (Prolly will remove this, but will stay for now for testing purposes)

        // Same as audioContextRef, we store these nodes in refs so we can access them later for cleanup
        sourceRef.current = source;
        gainNodeRef.current = gainNode;
        analyserRef.current = analyser;

        // 5. Create a data array to hold the frequency data
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        dataArrayRef.current = dataArray;

        // 6. Function to detect voice
        const detectVoice = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          if (avg > 30) {
            console.log("🎙️ Voice detected:", avg);
          }
          requestAnimationFrame(detectVoice); //This would be on loop para constanly ni chcheck niya yung media data 
        };

        // Start the whole function on loop
        detectVoice();
        console.log("🎤 Mic started and listening...");
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    };

    const stopListening = () => {
      try {
        // 1. Stop all tracks in the MediaStream
        if (micStreamRef.current) {
          micStreamRef.current.getTracks().forEach((t) => {
            t.stop();
          });
          micStreamRef.current = null;
        }

        // 2. Disconnect all nodes
        sourceRef.current?.disconnect();
        gainNodeRef.current?.disconnect();
        analyserRef.current?.disconnect();

        // 3. Clear node refs
        sourceRef.current = null;
        gainNodeRef.current = null;
        analyserRef.current = null;

        // 4. Close the AudioContext safely
        if (audioContextRef.current && audioContextRef.current.state !== "closed") {
          audioContextRef.current.close();
          console.log("micON changed:", micON);
        } else {
          console.log("AudioContext already closed — skipping");
        }

        audioContextRef.current = null;
      } catch (err) {
        console.warn("Error stopping mic:", err);
      }
    };

    // Reactively start/stop when micON changes
    if (micON) startListening();
    else stopListening();

    // Cleanup when component unmounts
    return stopListening;
  }, [!micON]);

  return (
    micON ? <div className="w-full px-4">Listening...</div> : null
  )

}
