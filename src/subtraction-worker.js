import { Point } from "@arcgis/core/geometry";

const point = new Point({ x: 0, y: 1, spatialReference: { wkid: 100 } });

export function doSubtraction(numbers) {
  let sum = 0;
  console.log(point.toJSON());
  for (let i = 0; i < numbers.length; i++) {
    sum -= numbers[i];
  }

  return sum;
}
