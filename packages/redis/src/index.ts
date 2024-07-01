import { sum } from 'lodash'

export function add(a: number, b: number) {
  return sum([a, b])
}

console.log(add(1, 2))