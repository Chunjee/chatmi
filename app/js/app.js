// (function() {
//   var getNode = function(element) {
//     return document.querySelector(element);
//   };

//   // Get required nodes
//   var status = getNode('.chat-status span');
//   var messages = getNode('.chat-messages');
//   var textArea = getNode('.chat textarea');
//   var chatName = getNode('.chat-name');
  
//   var statusDefault = status.textContent;
//   var setStatus = function(s) {
//     status.textContent = s;

//     if (s !== statusDefault) {
//       var delay = setTimeout(function() {
//         setStatus(statusDefault);
//         clearInterval(delay);
//       }, 3000);
//     }
//   };

//   // Try connection
//   try {
//     var socket = io.connect('http://127.0.0.1:3000');
//   } catch(e) {
//     // Set status to warn user
//   }

//   if (socket !== undefined) {
//     // Listen for output
//     socket.on('output', function(data) {
//       if (data.length) {
//         // Loop through results
//         for (var i = 0; i < data.length; i++) {
//           var message = document.createElement('p');
//           message.setAttribute('class', 'chat-message');
//           message.innerHTML = '<span style="color:#888;">' + data[i].timeStamp + '</span><span style="color:#2C3E50; font-weight:bold;font-size:15px;"> ' + data[i].name + ':</span> ' + data[i].message;

//           // Update messages
//           messages.appendChild(message);
//         }
//       }
//       updateScroll();
//     });

//     // Listen for a status
//     socket.on('status', function(data) {
//       setStatus((typeof data === 'object') ? data.message : data);
//       if (data.clear === true) {
//         textArea.value = '';
//       }
//     });

//     // Listen for keydown
//     textArea.addEventListener('keydown', function(event) {
//       var self = this;
//       var name = chatName.value;

//       if (event.which === 13 && event.shiftKey === false) {
//         var currentDate = new Date;

//         // Format timestamp to XX:XX, AM/PM
//         function hourSuffix() {
//           var currentHour = currentDate.getHours();
//           var currentMinute = currentDate.getMinutes();
//           if (currentHour > 12) {
//             currentHour = currentDate.getHours() - 12;
//           }
//           if (currentMinute < 10) {
//             currentMinute = "0" + currentMinute;
//           }
//           if (currentHour < 10) {
//             currentHour = "0" + currentHour;
//             return currentHour + ":" + currentMinute + "pm";
//           } else {
//             return currentHour + ":" + currentMinute + "am";
//           }
//         }

//         var timeStamp = hourSuffix();
//         socket.emit('input', {
//           name: name, 
//           message: self.value,
//           currentDate: currentDate,
//           timeStamp: timeStamp
//         });
//         event.preventDefault();
//       }
//     });
//   }
// })();

// // Scroll to most recent message
// var updateScroll = function() {
//   var element = document.getElementById("scrollbox");
//   element.scrollTop = element.scrollHeight;
// };
// document.onload = updateScroll();
