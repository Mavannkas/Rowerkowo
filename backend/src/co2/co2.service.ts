import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Co2Entity } from './entities/co2.entity';
import { Model } from 'mongoose';
import { AirQualityNearToRoadDto } from './dto/AirQualityNearToRoad.dto';
import { getSquare } from 'src/utils/distance.utils';

@Injectable()
export class Co2Service {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Co2Entity.name) private co2Model: Model<Co2Entity>,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCo2Data() {
    console.log('Starting CO2 data handling process');
    await this.co2Model.deleteMany({});
    try {
      const stations = await this.fetchAllStations();
      console.log(`Fetched ${stations.length} stations`);
      const filteredStations = this.filterStationsByRegion(
        stations,
        'MAŁOPOLSKIE',
      );
      console.log(`Filtered ${filteredStations.length} stations`);
      const data = await this.fetchStationData(filteredStations);

      await this.saveData(data);
      console.log('CO2 data handling process completed successfully');
    } catch (error) {
      console.error('Error during CO2 data handling process', error.stack);
    }
  }

  private async fetchAllStations(): Promise<any[]> {
    console.log('Fetching all stations');
    const response = await this.httpService.axiosRef.get(
      'https://api.gios.gov.pl/pjp-api/v1/rest/station/findAll?size=500',
    );
    let totalPages = response.data.totalPages;
    let stations = [...response.data['Lista stacji pomiarowych']];

    for (let i = 2; i <= totalPages; i++) {
      const response = await this.httpService.axiosRef.get(
        `https://api.gios.gov.pl/pjp-api/v1/rest/station/findAll?page=${i}&size=500`,
      );
      stations = [...stations, ...response.data['Lista stacji pomiarowych']];
    }

    console.log(`Fetched ${stations.length} stations`);
    return stations;
  }

  private filterStationsByRegion(stations: any[], region: string): any[] {
    console.log(`Filtering stations by region: ${region}`);
    return stations.filter((station) => station['Województwo'] === region);
  }

  private async fetchStationData(
    stations: any[],
  ): Promise<Omit<Co2Entity, '_id'>[]> {
    console.log('Fetching station data');
    console.log('Stations: ', stations);
    let data: Omit<Co2Entity, '_id'>[] = [];

    for (let station of stations) {
      console.log(
        `Fetching data for station: ${station['Identyfikator stacji']}`,
      );
      const response = await this.httpService.axiosRef.get(
        `https://api.gios.gov.pl/pjp-api/v1/rest/aqindex/getIndex/${station['Identyfikator stacji']}`,
      );

      data.push({
        latitude: station['WGS84 φ N'],
        longitude: station['WGS84 λ E'],
        value: this.getIndexWeightByCategory(
          response.data.AqIndex['Nazwa kategorii indeksu'],
        ),
      });
    }

    console.log(`Fetched data for ${data.length} stations`);
    return data;
  }

  private async saveData(data: Omit<Co2Entity, '_id'>[]): Promise<void> {
    console.log('Saving data to database');
    for (let record of data) {
      const co2 = new this.co2Model({ ...record });
      await co2.save();
    }
    console.log('Data saved successfully');
  }

  private getIndexWeightByCategory(category: string): number {
    console.log(`Getting index weight for category: ${category}`);
    switch (category) {
      case 'Bardzo dobry':
        return 1;
      case 'Dobry':
        return 0.8;
      case 'Umiarkowany':
        return 0.6;
      case 'Dostateczny':
        return 0.4;
      case 'Zły':
        return 0.2;
      case 'Bardzo zły':
        return 0;
      default:
        return 1;
    }
  }

  public async getAirQualityNearRoad({
    startLatitude,
    startLongitude,
    endLatitude,
    endLongitude,
  }: AirQualityNearToRoadDto): Promise<number> {
    if(!startLatitude || !startLongitude || !endLatitude || !endLongitude) {
      throw new BadRequestException('Missing required parameters');
    }

    const distance = 5000;

    console.log(`Distance between points: ${distance} meters`);

    const startSquare = getSquare(startLatitude, startLongitude, distance);

    console.log('Start square: ', startSquare);
    const endSquare = getSquare(endLatitude, endLongitude, distance);

    const co2DataStart = await this.co2Model.find({
      latitude: {
        $gte: startSquare.latitudeBottom,
        $lte: startSquare.latitudeTop,
      },
      longitude: {
        $gte: startSquare.longitudeBottom,
        $lte: startSquare.longitudeTop,
      },
    });

    const co2DataEnd = await this.co2Model.find({
      latitude: {
        $gte: endSquare.latitudeBottom,
        $lte: endSquare.latitudeTop,
      },
      longitude: {
        $gte: endSquare.longitudeBottom,
        $lte: endSquare.longitudeTop,
      },
    });
    //remove duplicates by __id

    const co2Data = [...co2DataStart, ...co2DataEnd].filter(
      (value, index, self) =>
        self.findIndex((t) => t._id === value._id) === index,
    );


    console.log(`Fetched ${co2Data.length} records`);
    console.log(co2Data);

    //calculate average value
    const averageValue =
      co2Data.reduce((acc, curr) => acc + curr.value, 0) / co2Data.length;

    return averageValue || 1;
  }

  //distance in meters between two points in latitude and longitude
  
}
