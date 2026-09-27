export function licensedModelRequested(search: string) {
  return new URLSearchParams(search).get('model') === 'licensed'
}
