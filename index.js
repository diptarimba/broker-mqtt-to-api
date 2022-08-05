const mqtt = require('mqtt')
const axios = require('axios').default;
const client = mqtt.connect(process.env.URL_MQTT_SERVER)

const options = {
  headers: {
    "content-type": "application/json"
  }
};

client.on('connect', function () {
  client.subscribe(process.env.TOPIC_MQTT_SERVER, function (err) {
    if (!err) {
      console.log('Berhasil Connect!');
      //client.publish('parking/machine/status', 'Hello madefaker')
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())

  if (message.toString() !== '') {
    try {
      JSON.parse(message.toString())
      axios.post(process.env.API_PAYMENT_GATEWAY, message.toString(), options)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (e) {
      console.log('error');
    }
  }
})