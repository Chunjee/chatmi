'use strict';

var React = require('react');
var ReactDOM = require('react-dom')
var request = require('superagent');
var socket = io.connect(process.env.SOCKET || 'localhost:3000');

var App = React.createClass({
  render: function() {
    return (
      <main id="chatroom-container">
        <h1>
          <a href="/">ChatMi</a>
          <span> | </span>
          <span><a href={"/"+roomName}>{roomName}</a></span>
        </h1>
        <input id="chat-username" type="text" placeholder="Type your message"/>
        <ChatMessageList/>
        <textarea placeholder="Type your message"></textarea>
        <div id="chat-status">Status: <span id="current-status">Idle</span></div> 
      </main>
    );
  }
});

var ChatMessageList = React.createClass({
  getInitialState: function() {
    socket.on('newMessageToRender', function(data, thisRoom) {
      this.renderNewMessage(data, thisRoom);
    }.bind(this));
    return {
      listOfMessages: []
    }
  },
  componentDidMount: function() {
    var url = 'http://localhost:3000/api/' + roomName;
    request
      .get(url)
      .end(function(err, res) {
        this.setState({
          listOfMessages: res.body
        });
      }.bind(this));
  },
  componentDidUpdate:function() {
    // Scroll to most recent message whenever state changes
    var element = document.getElementById('chat-message-display');
    element.scrollTop = element.scrollHeight;
  },
  renderNewMessage: function(data, thisRoom) {
    // Check if incoming data should be rendered in current room, then push to state
    if (data.message.length && thisRoom === roomName) {
      this.state.listOfMessages.push({name: data.name, message: data.message, timeStamp: data.timeStamp});
      this.setState({
        listOfMessages: this.state.listOfMessages
      });
    }
  },
  render: function() {
    return (
      <div id="chat-message-display">
        {this.state.listOfMessages.map(function(item) {
          return (
            <p className='chat-message'>
              <span className='message-timestamp'>{item.timeStamp}</span>
              <span className='message-name'>{item.name}</span>
              <span className='message-content'>{item.message}</span>
            </p>
          );
        })}
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('chatroom-container'));
