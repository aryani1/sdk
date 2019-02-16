// @flow
import { journeyPlannerQuery } from '../api'
import {
    BUS, TRAM, RAIL, METRO, WATER, AIR, COACH, CAR,
} from '../constants/travelModes'

import {
    getDeparturesFromStopPlacesQuery,
    getDeparturesFromQuayQuery,
    getDeparturesBetweenStopPlacesQuery,
} from './query'

import type {
    StopPlaceDepartures,
    QuayDepartures,
    Departure,
} from '../../flow-types/Departures'


type GetDeparturesParams = {
    includeNonBoarding?: boolean,
    limit?: number,
    start?: Date,
    timeRange?: number,
}
export function getDeparturesFromStopPlaces(
    stopPlaceIds: Array<string>,
    params?: GetDeparturesParams = {},
): Promise<Array<StopPlaceDepartures>> {
    const {
        limit = 50,
        timeRange = 72000,
        start = new Date(),
        includeNonBoarding = false,
        ...rest
    } = params

    const variables = {
        ids: stopPlaceIds,
        start: start.toISOString(),
        omitNonBoarding: !includeNonBoarding,
        timeRange,
        limit,
        ...rest,
    }

    return journeyPlannerQuery(getDeparturesFromStopPlacesQuery, variables, undefined, this.config)
        .then((data: Object = {}) => {
            if (!data?.stopPlaces) {
                return []
            }

            return data.stopPlaces.map(({ estimatedCalls, ...stopPlace }) => ({
                ...stopPlace,
                departures: estimatedCalls,
            }))
        })
}

export function getDeparturesFromStopPlace(
    stopPlaceId: string,
    params?: GetDeparturesParams,
): Promise<Array<Departure>> {
    return getDeparturesFromStopPlaces.call(this, [stopPlaceId], params)
        .then((stopPlaces: Array<StopPlaceDepartures>) => stopPlaces?.[0]?.departures || [])
}

export function getDeparturesFromQuays(
    quayIds: Array<string>,
    params?: GetDeparturesParams = {},
): Promise<Array<QuayDepartures>> {
    const {
        limit = 30,
        timeRange = 72000,
        includeNonBoarding = false,
        start = new Date(),
        ...rest
    } = params

    const variables = {
        ids: quayIds,
        start: start.toISOString(),
        omitNonBoarding: !includeNonBoarding,
        timeRange,
        limit,
        ...rest,
    }
    return journeyPlannerQuery(getDeparturesFromQuayQuery, variables, undefined, this.config)
        .then((data: Object = {}) => {
            if (!data?.quays) {
                return []
            }

            return data.quays.map(({ estimatedCalls, ...stopPlace }) => ({
                ...stopPlace,
                departures: estimatedCalls,
            }))
        })
}

export type GetDeparturesBetweenStopPlacesParams = {
    limit?: number,
    start?: Date
}
export function getDeparturesBetweenStopPlaces(
    fromStopPlaceId: string,
    toStopPlaceId: string,
    params?: GetDeparturesBetweenStopPlacesParams = {},
): Promise<Array<Departure>> {
    const {
        limit = 20,
        start = new Date(),
        ...rest
    } = params
    const variables = {
        from: { place: fromStopPlaceId },
        to: { place: toStopPlaceId },
        limit,
        dateTime: start.toISOString(),
        arriveBy: false,
        modes: [BUS, TRAM, RAIL, METRO, WATER, AIR, COACH, CAR],
        ...rest,
    }

    return journeyPlannerQuery(
        getDeparturesBetweenStopPlacesQuery,
        variables,
        undefined,
        this.config,
    )
        .then((data: Object) => {
            if (!data?.trip?.tripPatterns) {
                return []
            }

            return data.trip.tripPatterns.map((trip) => {
                const [leg] = trip.legs
                if (!leg) {
                    return
                }
                const { fromEstimatedCall } = leg

                // eslint-disable-next-line consistent-return
                return {
                    date: fromEstimatedCall.date,
                    forBoarding: fromEstimatedCall.forBoarding,
                    requestStop: fromEstimatedCall.requestStop,
                    forAlighting: fromEstimatedCall.forAlighting,
                    destinationDisplay: fromEstimatedCall.destinationDisplay,
                    notices: fromEstimatedCall.notices,
                    aimedDepartureTime: leg.aimedStartTime,
                    expectedDepartureTime: leg.expectedStartTime,
                    realtime: leg.realtime,
                    situations: leg.situations,
                    quay: leg.fromPlace.quay,
                    destinationQuay: leg.toPlace.quay,
                    serviceJourney: leg.serviceJourney,
                }
            }).filter(Boolean)
        })
}

export function getStopPlaceDeparturesDEPRECATED() {
    throw new Error('Entur SDK: "getStopPlaceDepartures" is deprecated, use "getDeparturesForStopPlace" or getDeparturesForStopPlaces instead.')
}
