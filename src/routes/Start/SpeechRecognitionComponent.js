import React, {useEffect, useState} from "react";
import axios from "axios";

const SpeechRecognitionComponent = ({setInterimTranscription, setFinalTranscription}) => {

    const [selectedLang, setSelectedLang] = useState('en-US');
    const handleLanguageChange = (event) => {
        setSelectedLang(event.target.value);
    };

    //To create a new speech recognition object 'recognition'
    const recognition = new (
        window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition)();

    //To configure recognition whenever recognition or selected language changes
    useEffect(() => {
        recognition.lang = selectedLang;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
    }, [recognition, selectedLang]);


    useEffect(() => {
        recognition.onresult = async (event) => {
            let interim_transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    setFinalTranscription((prevTranscription) => prevTranscription + event.results[i][0].transcript + ' ');
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
            setInterimTranscription(interim_transcript);
        };

        recognition.onerror = (event) => {
            console.log('Error occurred in recognition: ' + event.error);
        };

        recognition.onend = () => {
            recognition.start(); // Restart recognition when it ends
        };

    }, [recognition]);



    return (
        <div className="select-button-container">
            <label htmlFor="language"></label>
            <select id="language" value={selectedLang} onChange={handleLanguageChange}>
                <option value="en-US">English</option>
                <option value="zh-CN">Chinese</option>
            </select>
            <button onClick={() => recognition.start()}>Start</button>
        </div>
    );
};

export default SpeechRecognitionComponent;