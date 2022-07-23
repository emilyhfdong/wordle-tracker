export class Timer {
  startTime: number
  lastStopTime: number

  constructor() {
    this.startTime = Date.now()
    this.lastStopTime = Date.now()
  }

  getTimeSinceLastStop() {
    const now = Date.now()
    const duration = now - this.lastStopTime
    this.lastStopTime = now
    return duration
  }

  getTotalDuration() {
    return Date.now() - this.startTime
  }
}
