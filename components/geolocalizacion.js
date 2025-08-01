export const setupCompanyMap_AHGA = () => {
  const latEmpresa_AHGA = 10.40974;
  const lngEmpresa_AHGA = -66.827068;

  const mapContainer_AHGA = document.getElementById("map");
  if (!mapContainer_AHGA) return;

  const mapEmpresa_AHGA = L.map("map").setView(
    [latEmpresa_AHGA, lngEmpresa_AHGA],
    17
  );

  L.tileLayer("/osm-tiles/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapEmpresa_AHGA);

  L.marker([latEmpresa_AHGA, lngEmpresa_AHGA])
    .addTo(mapEmpresa_AHGA)
    .bindPopup("<b>Nexus AG C.A.</b><br>Oripoto, Caracas")
    .openPopup();
};
