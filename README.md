# backend

WS:
mobileApp
admoniApp

Rest API:
webApp

# Client connection

const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
ws.send(JSON.stringify({ type: 'desktop' })); // type: admin | mobile
console.log('Connected as desktop client');
};

#
