import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import RecognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone';

class App extends Component {
    constructor() {
        super();
        this.state = {};
    }

    onListenClick() {

        const self = this;

        fetch('http://localhost:3002/api/speech-to-text/token')

            .then((response) => response.text())

            .then((token) => {
                const stream = RecognizeMicrophone({
                    token: token,
                    objectMode: true, // send objects instead of text
                    extractResults: true, // convert {results: [{alternatives:[...]}], result_index: 0} to {alternatives: [...], index: 0}
                    format: false // optional - performs basic formatting on the results such as capitals an periods
                });
                stream.on('data', (data) => {
                    console.log(data);
                    self.setState({
                        text: data.alternatives[0].transcript
                    });
                });
                stream.on('error', (err) => {
                    console.log(err);
                });

                document.querySelector('#stop').onclick = stream.stop.bind(stream);
            })

            .catch(function(error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h2 className="App-title">Welcome to Speech to Text</h2>
                </header>
                <button className="App-speech-button" onClick={this.onListenClick.bind(this)}>Listen to microphone</button>
                <button className="App-speech-button" id="stop">Stop</button>
                <div className="App-speech-text">{this.state.text}</div>
            </div>
        );
    }
}

export default App;
