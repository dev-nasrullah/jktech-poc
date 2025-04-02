import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseService {
  response<T>(data?: T) {
    if (!data) {
      return {
        message: 'Success',
      };
    }

    return {
      message: 'Success',
      data,
    };
  }
}
