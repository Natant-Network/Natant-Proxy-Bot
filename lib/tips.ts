export default function getTips(custom: Array<string>) {
  return [
    'Did you know: Some commands have context menu versions. Try them out by right clicking on a user, and select Apps!',
    ...custom
  ]
}