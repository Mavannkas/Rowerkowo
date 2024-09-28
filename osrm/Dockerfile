FROM osrm/osrm-backend

WORKDIR /data

COPY malopolskie-latest.osm.pbf ./

RUN osrm-extract -p /opt/bicycle.lua malopolskie-latest.osm.pbf
RUN osrm-partition malopolskie-latest.osrm
RUN osrm-customize malopolskie-latest.osrm

CMD osrm-routed --algorithm mld malopolskie-latest.osrm

EXPOSE 5001