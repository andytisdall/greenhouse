import React, { useRef, useEffect } from 'react';
import WaveformData from 'waveform-data';

const Waveform = ({ audio, isRecording, audioContext }) => {
  const canvas = useRef();

  useEffect(async () => {
    if (isRecording && canvas.current) {
      const ctx = canvas.current.getContext('2d');
      ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    } else {
      renderWaveform();
    }
  }, [isRecording]);

  const renderWaveform = async () => {
    // const reader = new FileReader();

    // reader.onload = (event) => {
    //   const buffer = event.target.result;
    //   const options = {
    //     audio_context: audioContext,
    //     array_buffer: buffer,
    //     scale: 128,
    //   };
    const buffer = await audio.arrayBuffer();
    console.log(buffer);
    const options = {
      audio_context: audioContext,
      array_buffer: buffer,
      scale: 128,
    };

    WaveformData.createFromAudio(options, (err, waveform) => {
      if (err) {
        console.log(err);
      } else {
        drawWaveform(waveform);
      }
    });
    // };

    // reader.readAsArrayBuffer(audio);
  };

  const drawWaveform = (waveform) => {
    const ctx = canvas.current.getContext('2d');

    const lengthMultiplier = waveform.length / 300;

    const scaleY = (amplitude, height) => {
      const range = 256;
      const offset = 128;

      return height - ((amplitude + offset) * height) / range;
    };

    ctx.beginPath();

    const channel = waveform.channel(0);

    // Loop forwards, drawing the upper half of the waveform
    for (let x = 0; x < waveform.length; x++) {
      const val = channel.max_sample(x);

      ctx.lineTo(x / lengthMultiplier, scaleY(val, canvas.current.height));
    }

    // Loop backwards, drawing the lower half of the waveform
    for (let x = waveform.length - 1; x >= 0; x--) {
      const val = channel.min_sample(x);

      ctx.lineTo(x / lengthMultiplier, scaleY(val, canvas.current.height));
    }

    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  };

  return <canvas ref={canvas} />;
};

export default Waveform;
