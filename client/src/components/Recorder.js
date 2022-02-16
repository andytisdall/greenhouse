import React, { useEffect, useRef, useState } from 'react';
import vmsg from '../vmsg';

import Timer from './Timer';
import DeviceControl from './DeviceControl';
import AddRecording from './AddRecording';

const Recorder = ({ match }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audio, setAudio] = useState();
  const [inputSource, setInputSource] = useState();
  const [error, setError] = useState('');

  const mediaRecorder = useRef();

  useEffect(async () => {
    // Initialize vmsg recorder
    mediaRecorder.current = new vmsg.Recorder({
      wasmURL: 'https://unpkg.com/vmsg@0.3.0/vmsg.wasm',
    });
  }, []);

  const onRecord = async () => {
    if (!isLoading) {
      setIsLoading(true);
      if (!isRecording) {
        try {
          await navigator.mediaDevices.getUserMedia({
            audio: {
              deviceId: inputSource.deviceId,
            },
          });
          await mediaRecorder.current.initAudio();
          await mediaRecorder.current.initWorker();
          mediaRecorder.current.startRecording();
          setIsLoading(false);
          setIsRecording(true);
        } catch (err) {
          console.error(err);
          setIsLoading(false);
          setError(err.message);
        }
      } else {
        try {
          const blob = await mediaRecorder.current.stopRecording();
          setAudio(blob);
          setIsLoading(false);
          setIsRecording(false);
        } catch (err) {
          console.error(err);
          setIsLoading(false);
          setError(err.message);
        }
      }
    }
  };

  const renderButtons = () => {
    return (
      <div className="recorder-buttons">
        <div onClick={onRecord} className="recorder-btn">
          {isRecording ? 'Stop' : 'Record'}
        </div>
      </div>
    );
  };

  const renderDisplay = () => {
    let display = '';
    if (audio && !isRecording) {
      const url = URL.createObjectURL(audio);
      display = <audio controls src={url} />;
    } else if (isRecording) {
      display = <Timer isRecording={isRecording} />;
    }
    return <div className="playhead-container">{display}</div>;
  };

  const renderSpinner = () => {
    return (
      <div className="sk-circle-fade">
        <div className="sk-circle-fade-dot"></div>
        <div className="sk-circle-fade-dot"></div>
        <div className="sk-circle-fade-dot"></div>
        <div className="sk-circle-fade-dot"></div>
        <div className="sk-circle-fade-dot"></div>
        <div className="sk-circle-fade-dot"></div>
        <div className="sk-circle-fade-dot"></div>
        <div className="sk-circle-fade-dot"></div>
        <div className="sk-circle-fade-dot"></div>
        <div className="sk-circle-fade-dot"></div>
        <div className="sk-circle-fade-dot"></div>
        <div className="sk-circle-fade-dot"></div>
      </div>
    );
  };

  return (
    <div className={isRecording ? 'recorder recording' : 'recorder'}>
      {error}
      {isLoading && renderSpinner()}
      {renderDisplay()}
      {renderButtons()}
      <DeviceControl
        inputSource={inputSource}
        setInputSource={setInputSource}
        isRecording={isRecording}
      />
      <AddRecording bandName={match.params.bandName} audio={audio} />
    </div>
  );
};

export default Recorder;
