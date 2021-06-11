import esriConfig from "@arcgis/core/config";
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import TileLayer from '@arcgis/core/layers/TileLayer';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import SearchViewModel from '@arcgis/core/widgets/Search/SearchViewModel';
import * as workers from "@arcgis/core/core/workers";
import * as asyncGeometryEngine from "@arcgis/core/geometry/geometryEngineAsync";
import Point from "@arcgis/core/geometry/Point";

import App from 'app/App';
import { initWidgets } from './widgets';

esriConfig.workers.workerPath = "./RemoteClient.js";

esriConfig.workers.loaderUrl = "https://cdn.jsdelivr.net/npm/systemjs@6.10.0/dist/s.min.js";

const featureLayer = new FeatureLayer({
  portalItem: {
    id: 'b234a118ab6b4c91908a1cf677941702',
  },
  outFields: ['NAME', 'STATE_NAME', 'VACANT', 'HSE_UNITS'],
  title: 'U.S. Counties',
  opacity: 0.8,
});

featureLayer.when(() => {
  view.goTo(featureLayer.fullExtent);
});

const view = new MapView({
  map: new Map({
    basemap: {
      baseLayers: [
        new TileLayer({
          portalItem: {
            // world hillshade
            id: '1b243539f4514b6ba35e7d995890db1d',
          },
        }),
        new VectorTileLayer({
          portalItem: {
            // topographic
            id: '7dc6cea0b1764a1f9af2e679f642f0f5',
          },
        }),
      ],
    },
    layers: [featureLayer],
  }),
});

const app = new App({
  view,
  title: 'ArcGIS Webpack Template',
  searchViewModel: new SearchViewModel({
    includeDefaultSources: false,
    sources: [
      {
        layer: featureLayer,
        outFields: ['NAME', 'STATE_NAME', 'VACANT', 'HSE_UNITS'],
        searchFields: ['NAME'],
        suggestionTemplate: '{NAME} County, {STATE_NAME}',
        placeholder: 'Search by County Name',
      },
    ],
  }),
  container: document.createElement('div'),
});

view.when(initWidgets);

document.body.append(app.container);

async function run() {
  let promises;

  let addme = await workers.open(new URL("./Addition.js", document.baseURI).href);
  let subtractme = await workers.open(new URL("./Subtraction.js", document.baseURI).href, { strategy: "dedicated" });

  promises = [];
  for (let p = 1; p < 50; p++) {
    promises.push(
      addme.invoke("doAddition", [1, 2, 3]).then((r) => {
        console.log("Adds - " + r.toString());
      })
    );
  }
  await Promise.all(promises);

  promises = [];
  for (let p = 1; p < 50; p++) {
    promises.push(
      subtractme.invoke("doSubtraction", [1, 2, 3]).then((r) => {
        console.log("Subtraction - " + r.toString());
      })
    );
  }
  await Promise.all(promises);

  promises = [];
  for (let j = 1; j < 50; j++) {
    promises.push(
        asyncGeometryEngine.union(
          [
            new Point({ x: 1, y: 1, spatialReference: { wkid: 102100 } }),
            new Point({ x: 1, y: 1, spatialReference: { wkid: 102100 } })
          ]
      )
    );
  }
  console.log(await Promise.all(promises));
}

run();
