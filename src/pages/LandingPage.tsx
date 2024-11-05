import { useState, useEffect, useRef } from 'react';
import { BACKEND_URL, univerOptions } from '../../utils/backendUrl.js';
import { useSocket, useUser } from '../Providers/Socket.js';
import JoinRoom from './JoinRoom';
import axios from 'axios';

function LandingPage() {
  const user = useUser();
  const [name, setName] = useState(user ? user?.user?.username : '');
  //@ts-ignore
  const roomId = user?.user?.roomId.length;
  //@ts-ignore
  const [school, setSchool] = useState('');
  const [choice, setChoice] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');
  const socket = useSocket();
  const [localaudiotrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [localvideotrack, setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);
  const [joined, setJoined] = useState(false);
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [roomIdConnect, setRoomIdConnect] = useState('');
  const [liveCount,setLiveCount] = useState(0);
  const [loading,setLoading] = useState(false);

  async function GetMedia() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setLocalAudioTrack(stream.getAudioTracks()[0]);
    setLocalVideoTrack(stream.getVideoTracks()[0]);
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }


  const fetchLiveUserNumbers = async()=>{
    setLoading(true);
    const live_numbers = await  axios.get(`${BACKEND_URL}/live-details`);
    if(live_numbers.data.status===200){
      setLiveCount(live_numbers.data.message);
    }
    else{
      setLiveCount(0);
    }
    setLoading(false);
  } 

  useEffect(()=>{
    fetchLiveUserNumbers();
  },[])



  useEffect(() => {
    if (videoRef && videoRef.current) {
      if (joined) {
        GetMedia();
      }
    }
  }, [joined]);

  const handleJoinRoom = () => {
    let universityToSend = selectedOption;
    if (roomIdConnect) {
      universityToSend = roomIdConnect;
    }
    socket!.emit('joinRoom', { name, university: universityToSend });
    if (localaudiotrack && localvideotrack) {
      setOpen(!open);
    }
  };

  if (open) {
    //@ts-ignore
    return <JoinRoom name={name} localaudiotrack={localaudiotrack} localvideotrack={localvideotrack} />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-[80%]">

           <span className="flex flex-col items-center mt-5">
            <h1 className="text-4xl font-extrabold text-center mb-6">Landing Page</h1>
            <div className="bg-gray-100  rounded-lg p-4 shadow-md h-[3rem]">
              {!loading ? (
                <p className="text-lg text-green-600 ">Live - {liveCount}</p>
              ) : (
                <p className="text-lg text-gray-500">Loading...</p>
              )}
            </div>
          </span>


      <p className="mt-4 mb-2">Connect with anyone</p>
      <div className="flex flex-col items-center">
        <p>Enter name</p>
        <input
          type="text"
          placeholder={name}
          className="border border-gray-300 rounded px-2 py-1 mt-2 mb-4 focus:outline-none"
          onChange={(e) => setName(e.target.value)}
        />
        {!choice && (
  <div className="flex flex-wrap justify-between w-full max-w-md mx-auto">
    {univerOptions.map((options, index) => (
      <div 
        key={index} 
        onClick={() => setSelectedOption(options)} 
        className="cursor-pointer hover:bg-blue-500 hover:text-white rounded-lg border border-gray-300 bg-white shadow-md transition duration-200 ease-in-out px-4 py-2 mt-2 text-center transform hover:scale-105"
      >
        {options}
      </div>
    ))}
  </div>
)}

        {!choice && (
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mt-4" onClick={() => setSelectedOption('')}>
            Clear option
          </button>
        )}

        <br />
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mt-4" onClick={() => setChoice(!choice)}>
          {choice ? 'Or enter selectively' : 'Change choice'}
        </button>
      </div>
      
      {roomId && roomId > 0 ? (
        <input
          type="text"
          placeholder="Enter roomId"
          className="border border-gray-300 rounded px-2 py-1 mt-4 focus:outline-none"
          onChange={(e) => setRoomIdConnect(e.target.value)}
        />
      ) : null} 

{!joined ? (
          <p onClick={() => setJoined(!joined)} className="cursor-pointer bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
            Start
          </p>
        ) : (
          <>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={handleJoinRoom}>
              Connect :))
            </button>
          </>
        )}

      <p className="mt-4">{selectedOption}</p>
      <video ref={videoRef} autoPlay muted playsInline className="max-w-full max-h-full mt-4" />
     
    </div>
  );
}

export default LandingPage;
