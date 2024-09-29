import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Direction } from 'readline';
import { RoutingMode } from './entities/direction.entity';

@Injectable()
export class DirectionsService {
  constructor(private readonly httpService: HttpService) {}

  async findRoute(
    start: string,
    end: string,
    mode?: RoutingMode,
  ): Promise<Direction> {
    let osrmUrl = process.env.DEFAULT_OSMR_URL;

    switch (mode) {
      case 'family':
        osrmUrl = process.env.FAMILY_OSMR_URL;
        break;
      case 'sport':
        osrmUrl = process.env.SPORT_OSMR_URL;
        break;
    }

    console.log(osrmUrl);

    const callUrl = `${osrmUrl}/route/v1/driving/${start};${end}?overview=false&steps=true&annotations=distance,duration`;

    const osmrResp = await this.httpService.axiosRef.get(callUrl);

    return osmrResp.data;
  }
}
