'use client';

import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import api from '@/lib/api';

export default function AtmTerminal() {
  const [terminalId, setTerminalId] = useState('demo-terminal-1');
  const [status, setStatus] = useState('Disconnected');
  const [hasConsent, setHasConsent] = useState(false);
  const [isConsultationActive, setIsConsultationActive] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const hubConnectionRef = useRef<signalR.HubConnection | null>(null);

  const initWebRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const turnRes = await api.get('/Rtc/turn');
      const iceServers = turnRes.data.iceServers || [{ urls: 'stun:stun.l.google.com:19302' }];

      const pc = new RTCPeerConnection({ iceServers });
      peerConnectionRef.current = pc;

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      const token = localStorage.getItem('token');
      const hubUrl = process.env.NEXT_PUBLIC_API_URL 
        ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') + '/hubs/terminal'
        : 'http://localhost:5000/hubs/terminal';

      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${hubUrl}?access_token=${token}&terminalId=${terminalId}`)
        .withAutomaticReconnect()
        .build();
      
      hubConnectionRef.current = connection;

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          connection.invoke('SendIceCandidate', terminalId, JSON.stringify(event.candidate));
        }
      };

      connection.on('ReceiveOffer', async (offerString: string) => {
        const offer = JSON.parse(offerString);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        connection.invoke('SendAnswer', terminalId, JSON.stringify(answer));
      });

      connection.on('ReceiveAnswer', async (answerString: string) => {
        const answer = JSON.parse(answerString);
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      });

      connection.on('ReceiveIceCandidate', async (candidateString: string) => {
        const candidate = JSON.parse(candidateString);
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      });

      await connection.start();
      setStatus('Connected via SignalR');

    } catch (err) {
      console.error('WebRTC Init Error:', err);
      setStatus('Error: ' + (err as Error).message);
    }
  };

  useEffect(() => {
    if (isConsultationActive) {
      initWebRTC();
    }
    
    return () => {
      if (isConsultationActive) {
        hubConnectionRef.current?.stop();
        peerConnectionRef.current?.close();
      }
    };
  }, [isConsultationActive, terminalId]);

  const initiateCall = async () => {
    const pc = peerConnectionRef.current;
    if (!pc) return;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    hubConnectionRef.current?.invoke('SendOffer', terminalId, JSON.stringify(offer));
  };

  const handleStartConsultation = () => {
    if (hasConsent) {
      setIsConsultationActive(true);
    }
  };

  if (!isConsultationActive) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Start aTM Consultation</h1>
          
          <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
            Please review and provide your consent to begin the secure video consultation.
          </div>

          <label className="flex items-start gap-3 mb-6 cursor-pointer group">
            <div className="flex-shrink-0 mt-1">
              <input 
                type="checkbox" 
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                checked={hasConsent}
                onChange={(e) => setHasConsent(e.target.checked)}
              />
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
              I hereby consent to participate in a video consultation and agree to the processing of my health data in accordance with the GDPR privacy policy.
            </span>
          </label>

          <button 
            onClick={handleStartConsultation}
            disabled={!hasConsent}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
              hasConsent 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Start Consultation
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">aTM Telepharmacy Terminal</h1>
      <div className="mb-4 text-sm text-gray-400">Status: {status}</div>
      <div className="flex gap-4">
        <div className="flex-1 bg-gray-900 rounded relative">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-auto rounded" />
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">Local</div>
        </div>
        <div className="flex-1 bg-gray-900 rounded relative">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-auto rounded" />
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">Remote</div>
        </div>
      </div>
      <button 
        onClick={initiateCall}
        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-bold transition-colors"
      >
        Call Terminal
      </button>
    </main>
  );
}
