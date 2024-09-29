import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Direction } from 'readline';
import { RoutingMode } from './entities/direction.entity';

@Injectable()
export class DirectionsService {
  constructor(private readonly httpService: HttpService) {}

  async findTrip(stops: string, mode?: RoutingMode): Promise<Direction> {

    let osrmUrl = this.createUrl(mode);
    
    console.log(osrmUrl);
    console.log(stops);

    const callUrl = `${osrmUrl}/trip/v1/driving/${stops}?overview=false&steps=true&annotations=distance,duration&source=first&destination=last`;

    const osmrResp = await this.httpService.axiosRef.get(callUrl);

    return osmrResp.data;
  }

  async findRoute(
    start: string,
    end: string,
    mode?: RoutingMode,
  ): Promise<Direction> {
    let osrmUrl = this.createUrl(mode);

    console.log(osrmUrl);

    const callUrl = `${osrmUrl}/route/v1/driving/${start};${end}?overview=false&steps=true&annotations=distance,duration`;

    const osmrResp = await this.httpService.axiosRef.get(callUrl);

    return osmrResp.data;
  }

  private createUrl(mode: RoutingMode) {
    let osrmUrl = process.env.DEFAULT_OSMR_URL;

    switch (mode) {
      case 'family':
        osrmUrl = process.env.FAMILY_OSMR_URL;
        break;
      case 'sport':
        osrmUrl = process.env.SPORT_OSMR_URL;
        break;
    }
    return osrmUrl;
  }
}
