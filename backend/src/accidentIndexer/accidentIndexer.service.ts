import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Accident, AccidentEntity } from './entities/accident.entity';
import { AccidentApiResponseData, RawAccident } from './accidentIndexer.types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AccidentIndexerService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(AccidentEntity.name) private accidentEntityModel: Model<AccidentEntity>,
) {}

  @Cron(CronExpression.EVERY_HOUR)
  async indexAccidents() {
    console.log('Indexing accidents');
    const accidents = await this.getAccidentData();
    await this.accidentEntityModel.deleteMany();
    await this.accidentEntityModel.insertMany(accidents);
  }

  async getAccidentData(): Promise<Accident[]> {
    const lastTwoYears = this.getLastTwoFullYears();
    const formData = new URLSearchParams();
    formData.append('type', 'DETAILS');
    formData.append('rok[]', lastTwoYears[0]);
    formData.append('rok[]', lastTwoYears[1]);
    formData.append('wybrane_wojewodztwa[]', '12');
    formData.append('rodzaj_pojazdu_uczestnika[]', '10');
    formData.append('groupBy', 'GMI');
    formData.append('obszar_mapy[topRightCorner][lat]', '56.97101128322185');
    formData.append('obszar_mapy[topRightCorner][lng]', '34.03564453125');
    formData.append('obszar_mapy[bottomLeftCorner][lat]', '42.17685757125389');
    formData.append('obszar_mapy[bottomLeftCorner][lng]', '4.9987792968750036');
    const accidentApiEndpoint = `${process.env.ACCIDENTS_API_URL}/app/api/nodes/post_zdarzenia.php`
    const { data } = await firstValueFrom(
      this.httpService.post<AccidentApiResponseData>(accidentApiEndpoint, formData.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }).pipe(),
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

  getLastTwoFullYears(): string[] {
    const currentYear = new Date().getFullYear();
    return [currentYear - 2, currentYear - 1].map(String);
  }
}