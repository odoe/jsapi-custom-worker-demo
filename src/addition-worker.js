import Map from "@arcgis/core/Map";

const map = new Map();
console.log(map);

export function doAddition(numbers) {
  let sum = 0;

  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }

  return sum;
}
