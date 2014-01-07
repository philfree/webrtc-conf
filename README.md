WebRTC is a free, open project that enables web browsers with Real-Time Communications (RTC) capabilities via simple JavaScript APIs .

WebRTC is supported in the following browsers.

    Desktop PC
        Google Chrome 23
        Mozilla Firefox 22[10]
        Opera 18[11]
    Android
        Google Chrome 28 (Enabled by default since 29)
        Mozilla Firefox 24[12]
        Opera Mobile 12

In order to use group video conference , we need to install (on server)

	1. NodeJS ( https://github.com/joyent/node/wiki/Installation )
	2. Express framework ( http://expressjs.com/ )
	3. Webrtc.io ( https://github.com/webRTC/webRTC.io )

To run group video conference , below are the steps

	1. Do a git clone : https://github.com/philfree/webrtc-conf.git . A folder “webrtc-conf” is created . This can be cloned anywhere in the system and not necessarily the webserver path like “/var/www” in case of linux / apache2 . The node.js helps in creating a virtual server , on top of which the group conference application runs .
	2. On entering the application directory , we find a folder “multi-user-chat” . Within that we find a directory labelled “site” . 
	3. Inside this directory , run the node command from the terminal : node server.js . This starts the server . 
	4. Enter in the URL followed by the port number (any port number will do . Port number is hardcoded in the application for now - [4000]) . 
	5. An option will pop up , asking for permission to access the webcam and microphone of the system . After accepting this request , the user is asked to start a new room to chat . 
	6. The URL generated can be sent out to other users who want to join the room to video conference .


