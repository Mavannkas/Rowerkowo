import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Direction } from 'readline';
import { RoutingMode } from './entities/direction.entity';

@Injectable()
export class DirectionsService {
  constructor(private readonly httpService: HttpService) {}
  
  async findRoute(start: string, end: string, mode?: RoutingMode): Promise<Direction> {

    let osmrUrl = process.env.DEFAULT_OSMR_URL

    switch (mode) {
      case "family":
        osmrUrl = process.env.FAMILY_OSMR_URL
        break;
      case "sport":
        osmrUrl = process.env.SPORT_OSMR_URL
        break;
    }

    const callUrl = `${osmrUrl}/route/v1/driving/${end};${start}`;

    const osmrResp = await this.httpService.axiosRef.get(callUrl);

    return osmrResp.data;
  }
}
