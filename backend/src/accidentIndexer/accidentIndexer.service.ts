import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Accident } from './entities/accident.entity';
import { AccidentApiResponseData, RawAccident } from './accidentIndexer.types';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity } from '../users/entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class AccidentIndexerService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
) {}

  @Cron(CronExpression.EVERY_HOUR)
  async indexAccidents() {
    const accidents = await this.getAccidentData();
    await this.userModel.insertMany(accidents);
  }

  async getAccidentData(): Promise<Accident[]> {
    const accidentApiParams = {
      type: 'DETAILS',
      rok: this.getLastTwoFullYears(),
      wybrane_wojewodztwa: [12], // Małopolskie
      rodzaj_pojazdu_uczestnika: [10], // Rower
      alkohol: false,
      groupBy: 'WOJ',
      obszar_mapy: {
        topRightCorner: {
          lat: 56.97101128322185,
          lng: 34.03564453125,
        },
        bottomLeftCorner: {
          lat: 42.17685757125389,
          lng: 4.9987792968750036,
        },
      }, //Coordinates containing the whole Małopolskie voivodeship
    };
    const accidentApiEndpoint = `${process.env.ACCIDENTS_API_URL}/app/api/nodes/post_zdarzenia.php`
    const { data } = await firstValueFrom(
      this.httpService.post<AccidentApiResponseData>(accidentApiEndpoint, accidentApiParams).pipe(),
    );
    return data.mapa.wojewodztwa.flatMap((wojewodztwo) =>
      wojewodztwo.powiaty.flatMap((powiat) =>
        powiat.gminy.flatMap((gmina) =>
          gmina.zdarzenia_detale.map(this.mapSingleAccident),
        ),
      ),
    );
  }

  mapSingleAccident(rawAccident: RawAccident): Accident {
    return {
      severity: rawAccident.ciezkosc,
      longitude: rawAccident.wsp_gps_x,
      latitude: rawAccident.wsp_gps_y,
    };
  }

  getLastTwoFullYears(): number[] {
    const currentYear = new Date().getFullYear();
    return [currentYear - 1, currentYear - 2];
  }
}