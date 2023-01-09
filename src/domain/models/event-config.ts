import { ObjectId } from 'mongodb'
// these are the configurable parameters of this event
export interface EventConfig {
  loopingTime: number
  limit: number
  offset: number
  eventId: ObjectId
}
