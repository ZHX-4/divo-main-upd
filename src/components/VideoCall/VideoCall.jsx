import { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const VideoCall = ({ appointmentId, doctorId, patientId, isDoctor }) => {
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });

    socket.on('callUser', (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: isDoctor ? patientId : doctorId,
        signalData: data,
        from: isDoctor ? doctorId : patientId
      });
    });

    peer.on('stream', (stream) => {
      partnerVideo.current.srcObject = stream;
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: caller });
    });

    peer.on('stream', (stream) => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const endCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Your Video */}
        <div className="relative">
          <video
            playsInline
            muted
            ref={userVideo}
            autoPlay
            className="rounded-lg shadow-lg w-full"
          />
          <span className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded">
            You
          </span>
        </div>

        {/* Partner's Video */}
        {callAccepted && !callEnded && (
          <div className="relative">
            <video
              playsInline
              ref={partnerVideo}
              autoPlay
              className="rounded-lg shadow-lg w-full"
            />
            <span className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded">
              {isDoctor ? 'Patient' : 'Doctor'}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {callAccepted && !callEnded ? (
          <button
            onClick={endCall}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full"
          >
            End Call
          </button>
        ) : (
          <button
            onClick={callUser}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-full"
          >
            Start Call
          </button>
        )}
      </div>

      {receivingCall && !callAccepted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">
              {isDoctor ? 'Patient is calling...' : 'Doctor is calling...'}
            </h3>
            <div className="flex gap-4">
              <button
                onClick={answerCall}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
              >
                Answer
              </button>
              <button
                onClick={() => setReceivingCall(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
