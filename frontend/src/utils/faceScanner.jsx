import { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import React from "react";

function FaceScanner({ faceOn }) {
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    let intervalId = null; // to clear face detection later

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((currentStream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = currentStream;
            console.log("Camera started");
          }
        })
        .catch((err) => {
          console.error("Camera permission denied", err);
        });
    };

    const stopVideo = () => {
      const video = videoRef.current;
      if (video && video.srcObject) {
        const stream = video.srcObject;
        stream.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
        console.log("Camera stopped");
      }
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const detectMyFace = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const canvas = canvasRef.current;
      const displaySize = {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      };

      faceapi.matchDimensions(canvas, displaySize);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    };

    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
        console.log("Models loaded");
        startVideo();

        // Start detecting after camera starts
        intervalId = setInterval(detectMyFace, 100);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    if (faceOn) {
      loadModels();
    } else {
      stopVideo();
    }

    return () => stopVideo();
  }, [faceOn]);

  return (
    <div className="relative w-full h-full bg-gray-500">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
}

export default FaceScanner;
