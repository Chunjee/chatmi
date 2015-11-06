'use strict';

var React = require('react');
var ReactDOM = require('react-dom')
var request = require('superagent');

var ChatroomList = React.createClass({
  getInitialState: function() {
    return {
      listOfChatrooms: []
    }
  },
  componentDidMount: function() {
    request
      .get('http://localhost:3000/api/home')
      .end(function(err, res) {
        this.setState({
          listOfChatrooms: res.body
        });
      }.bind(this));
  },
  render: function() {
    return (
      <div>
        {this.state.listOfChatrooms.map(function(item) {
          return (
            <a href={'/'+item.name} className='roomName'>{item.name}</a>
          )
        })}
      </div>
    );
  }
});

ReactDOM.render(<ChatroomList />, document.getElementById('chatroom-list'));




