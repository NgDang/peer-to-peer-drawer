import React, { useState, useEffect} from 'react'
import mqtt, { Client as MQTTClient } from 'mqtt';
import { MQTTMessage } from 'types/mqttService';

const HOST = 'ws://broker.emqx.io:8083/mqtt';

const connect = () => {
  return mqtt.connect(HOST, {
    keepalive: 30,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
      topic: 'WillMsg',
      payload: 'Connection Closed abnormally..!',
      qos: 0,
      retain: false,
    },
    rejectUnauthorized: false,
  });
}

const client = connect();

function useMQTTService() {
  const [payload, setPayload] = useState({});
  const [connectStatus, setConnectStatus] = useState('Connect');

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        setConnectStatus('Connected');
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        setConnectStatus('Reconnecting');
      });
      client.on('message', (topic, payload) => {
        const data = JSON.parse(payload.toString());
        setPayload(data);
      });
    }
  }, [client]);



  function pub(topic: string, data: MQTTMessage) {
    if (client) {
      const stringify = JSON.stringify({
        type: data.type,
        payload: data.payload,
      });
      client.publish(topic, stringify, { qos: 0 }, error => {
        if (error) {
          console.log('Publish error: ', error);
        }
      });
    }
  }

  function sub(topics: string | string[]) {
    const isArrTopic = Array.isArray(topics)
    const arrTopic = isArrTopic ? topics : [topics]
    arrTopic.forEach(
      topic => {
        if (client) {
          client.subscribe(topic, { qos: 0 }, error => {
            if (error) {
              console.log('sub error: ', error);
            }
          })
        }
      }
    );
  }

  function unSub(topics: string | string[]) {
    if (client) {
      client.unsubscribe(topics);
    }
  }

  return {
    mqttService: {
      pub, sub, unSub
    },
    mqttData: payload
  }
}

export default useMQTTService
