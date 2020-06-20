import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      meta: 200,
      data: "Hello World!! I am spot-it v1"
    };
  }
}
