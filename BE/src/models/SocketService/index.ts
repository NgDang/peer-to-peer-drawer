import express from "express";
import * as http from "http";

export class SocketService {
  public static readonly PORT:number = 8000;
  private app: express.Application | any;
  private server: http.Server | any;
  private io: SocketIO.Server | any;
  private port: string | number | any;

  constructor() {
    this.createServer();
    this.sockets();
    this.listen();
  }

  private createServer(): void {
    this.server = http.createServer(this.app);
  }

  private sockets(): void {
    this.io = require("socket.io").listen(this.server, { origins: '*:*'});
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });

    this.io.on("connect", (socket: any) => {
			socket.on('join-room', (userData) => {
				const { roomID, userID } = userData;
				socket.join(roomID);
				socket.to(roomID).broadcast.emit('new-user-connect', userData);
				socket.on('disconnect', () => {
					socket.to(roomID).broadcast.emit('user-disconnected', userID);
				});
				socket.on('emit-drawing-data', (message) => {
					socket.to(roomID).broadcast.emit('emit-drawing-data', { ...message, userData });
				});
				socket.on('display-media', (value) => {
					socket.to(roomID).broadcast.emit('display-media', { userID, value });
				});
				socket.on('user-video-off', (value) => {
					socket.to(roomID).broadcast.emit('user-video-off', value);
				});
			});

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}
