import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CurrentAccidentEntity } from './entities/current-accident';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CurrentAccidentDto } from './dto/AirQualityNearToRoad.dto';
import { Accident } from 'src/accidentIndexer/entities/accident.entity';
import {
  getDistanceFromLatLonInMeters,
  getSquare,
} from 'src/utils/distance.utils';

const api =
  'https://mapy.geoportal.gov.pl/iMapLite/imlDataService/service/data/clust/get/4028e4e54e6ceb84014e6ced4d1c0000/4028e4e54e6ceb84014e6ced4d230001?';

const initBbox =
  '408358.86315186694,113445.83405930133,738294.9396906868,382792.20608537877';
const filter = `(%27Status%27%3D%22Nowe%22%2C%22Potwierdzone%22%2C%22Potwierdzone%20(przekazane%20poza%20Policj%C4%99)%22%2C%22Potwierdzone%20(wyeliminowane)%22)%20AND%20(%27Typ%27%3D%22Akty%20wandalizmu%22%2C%22Grupowanie%20si%C4%99%20ma%C5%82oletnich%20zagro%C5%BConych%20demoralizacj%C4%85%22%2C%22K%C5%82usownictwo%22%2C%22Miejsce%20niebezpiecznej%20dzia%C5%82alno%C5%9Bci%20rozrywkowej%22%2C%22Nielegalne%20rajdy%20samochodowe%22%2C%22Niew%C5%82a%C5%9Bciwa%20infrastruktura%20drogowa%22%2C%22Poruszanie%20si%C4%99%20po%20terenach%20le%C5%9Bnych%20quadami%22%2C%22Przekraczanie%20dozwolonej%20pr%C4%99dko%C5%9Bci%22%2C%22Spo%C5%BCywanie%20alkoholu%20w%20miejscach%20niedozwolonych%22%2C%22U%C5%BCywanie%20%C5%9Brodk%C3%B3w%20odurzaj%C4%85cych%22%2C%22Wa%C5%82%C4%99saj%C4%85ce%20si%C4%99%20bezpa%C5%84skie%20psy%22%2C%22Wypalanie%20traw%22%2C%22Z%C5%82a%20organizacja%20ruchu%20drogowego%22)%20AND%20(((%27Typ%27!%3D%22Miejsce%20niebezpiecznej%20dzia%C5%82alno%C5%9Bci%20rozrywkowej%22%2C%22Zn%C4%99canie%20si%C4%99%20nad%20zwierz%C4%99tami%22%2C%22U%C5%BCywanie%20%C5%9Brodk%C3%B3w%20odurzaj%C4%85cych%22)AND((%27Status%27%3D%22Nowe%22%2C%22Weryfikacja%22%2C%22Potwierdzone%22%2C%22Potwierdzone%20(przekazane%20poza%20Policj%C4%99)%22)OR((%27Status%27%3D%22Niepotwierdzone%22)AND(%27Data%20modyfikacji%27%3E%3D1726869600000))OR((%27Status%27%3D%22Potwierdzone%20(wyeliminowane)%22)AND(%27Data%20modyfikacji%27%3E%3D1724796000000))))OR((%27Typ%27%3D%22Miejsce%20niebezpiecznej%20dzia%C5%82alno%C5%9Bci%20rozrywkowej%22)AND((%27Status%27%3D%22Potwierdzone%22)OR(%27Status%27%3D%22Potwierdzone%20(przekazane%20poza%20Policj%C4%99)%22)OR((%27Status%27%3D%22Potwierdzone%20(wyeliminowane)%22)AND(%27Data%20modyfikacji%27%3E%3D1724796000000)))))`;

@Injectable()
export class CurrentAccidentsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(CurrentAccidentEntity.name)
    private currentAccudentModel: Model<CurrentAccidentEntity>,
  ) {}
  async getAll({
    startLatitude,
    startLongitude,
    endLatitude,
    endLongitude,
  }: CurrentAccidentDto) {
    if (!startLatitude || !startLongitude || !endLatitude || !endLongitude) {
      throw new BadRequestException('Missing required parameters');
    }

    const distance =
      getDistanceFromLatLonInMeters(
        startLatitude,
        startLongitude,
        endLatitude,
        endLongitude,
      ) / 2.4;

    console.log(`Distance between points: ${distance} meters`);

    const startSquare = getSquare(startLatitude, startLongitude, distance);

    console.log('Start square: ', startSquare);
    const endSquare = getSquare(endLatitude, endLongitude, distance);

    console.log('End square: ', endSquare);

    const accidentDataStart = await this.currentAccudentModel.find({
      latitude: {
        $gte: startSquare.latitudeBottom,
        $lte: startSquare.latitudeTop,
      },
      longitude: {
        $gte: startSquare.longitudeBottom,
        $lte: startSquare.longitudeTop,
      },
    });

    const accidentDataEnd = await this.currentAccudentModel.find({
      latitude: {
        $gte: endSquare.latitudeBottom,
        $lte: endSquare.latitudeTop,
      },
      longitude: {
        $gte: endSquare.longitudeBottom,
        $lte: endSquare.longitudeTop,
      },
    });

    const accidentsData = [...accidentDataStart, ...accidentDataEnd].filter(
      (value, index, self) =>
        self.findIndex((t) => t._id === value._id) === index,
    );

    console.log(`Found ${accidentsData.length}, in proximity to road`);
    const accidentsValue = accidentsData.reduce(
      (acc, accident) => acc + (1 - accident.value),
      0,
    );
    console.log(accidentsValue)
    return Math.max((20 - accidentsValue) / 20, 0);
  }
  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCurrentAccidents() {
    console.log('Starting current accidents handling process');
    const features = await this.fetchCurrentAccidents(initBbox);
    console.log(`Fetched ${features.length} features`);
    const mappedFeatures = features.map((feature) => ({
      value: this.getValueByType(feature.attributes.Typ),
      latitude: +(feature.geometry.y / 10000).toFixed(6),
      longitude: +(feature.geometry.x / 10000).toFixed(6),
    }));

    await this.currentAccudentModel.deleteMany({});

    await this.currentAccudentModel.insertMany(mappedFeatures);
  }
  getValueByType(type: string): number {
    switch (type) {
      case 'Przekraczanie dozwolonej prędkości':
        return 0.5; // Bardziej niebezpieczne dla dzieci
      case 'Niewłaściwa infrastruktura drogowa':
        return 0.2; // Zły stan infrastruktury zwiększa ryzyko dla dzieci
      case 'Używanie środków odurzających':
        return 0.1; // Duże zagrożenie, szczególnie dla dzieci
      case 'Kłusownictwo':
        return 0.6; // Mniejsze zagrożenie, ale nadal warto uważać
      case 'Zła organizacja ruchu drogowego':
        return 0.3; // Zła organizacja ruchu zwiększa ryzyko dla młodszych rowerzystów
      case 'Miejsce niebezpiecznej działalności rozrywkowej':
        return 0.2; // Bardzo niebezpieczne dla dzieci
      case 'Wypalanie traw':
        return 0.1; // Ekstremalne zagrożenie
      case 'Akty wandalizmu':
        return 0.4; // Średnie zagrożenie, ale mogą się zdarzyć niebezpieczne sytuacje
      case 'Grupowanie się małoletnich zagrożonych demoralizacją':
        return 0.5; // Zjawisko ryzykowne, ale niekoniecznie bezpośrednie zagrożenie dla ruchu
      case 'Nielegalne rajdy samochodowe':
        return 0.1; // Skrajnie niebezpieczne dla dzieci
      case 'Poruszanie się po terenach leśnych quadami':
        return 0.3; // Może być niebezpieczne
      case 'Spożywanie alkoholu w miejscach niedozwolonych':
        return 0.4; // Średnie ryzyko, ale dzieci mogą być narażone na niebezpieczne zachowania
      case 'Wałęsające się bezpańskie psy':
        return 0.6; // Umiarkowane ryzyko
      default:
        return 1; // Brak zdarzeń, pełne bezpieczeństwo
    }
  }
  async fetchCurrentAccidents(bbox: string): Promise<Feature[]> {
    console.log('Fetching current accidents');
    console.log(`${api}bbox=${bbox}&filtr=${filter}&s=-1`);
    const featuresResponse = await this.httpService.axiosRef.get(
      `${api}bbox=${bbox}&filtr=${filter}&s=-1`,
    );
    console.log(featuresResponse.data);
    let response = [...featuresResponse.data.features];
    for (const feature of featuresResponse.data.clusters) {
      const features = await this.fetchCurrentAccidents(
        feature.extent.join(','),
      );
      response = [...response, ...features];
    }
    return response;
  }
}

interface Feature {
  attributes: {
    OBJECTID: number;
    Status: string;
    Pora_dnia: number;
    Typ: string;
    Dni_tygodnia: number;
    Data_zdarzenia: number;
    Data_modyfikacji: number;
    TERYT: string;
    Data_utworzenia: number;
  };
  geometry: {
    y: number;
    x: number;
    esriGeometryType: string;
    spatialReference: {
      wkid: number;
    };
  };
  attachments: null;
}
