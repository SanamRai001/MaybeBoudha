export function selectiveHybridRequested(search: string) {
  return new URLSearchParams(search).get('selective') === '1'
}
