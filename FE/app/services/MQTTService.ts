import mqtt, { Client as MQTTClient } from 'mqtt';
import { MQTTMessage } from 'types/mqttService'

const HOST = 'ws://broker.emqx.io:8083/mqtt'


class MQTTService {
  private _client: MQTTClient;

  constructor() {
    this._client = this.connect();
  }

  connect() {
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
        retain: false
      },
      rejectUnauthorized: false,
    });
  }

  pub(topic: string, data: MQTTMessage): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (this._client) {
        const stringify = JSON.stringify({
          type: data.type,
          payload: data.payload
        });
        this._client.publish(topic, stringify, { qos: 0 }, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(null);
          }
        });
      } else {
        reject('Something when wrong');
      }
    })
  }

  sub(topics: string[]): Promise<unknown>[] {
    const promises = topics.map(topic => new Promise((resolve, reject) => {
      if (this._client) {
        console.log(topic);
        this._client.subscribe(topic, { qos: 0 }, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(null);
          }
        });
      } else {
        reject('Something when wrong');
      }
    }))
    return promises;
  }

  unSub(topics: string | string[]){
    this._client.unsubscribe(topics);
  }

  handleTopic(topic: string | string[], callback: Function) {
    this._client.on('message', (msgTopic, payload) => {
      const match = typeof topic === 'string' ? topic === msgTopic : topic.includes(msgTopic);
      console.log(msgTopic, match);
      if (match) {
        const data = JSON.parse(payload.toString());
        callback(data, msgTopic);
      }
    })
  }

}

export default new MQTTService();
