// @flow
import { VariableType } from 'json-to-graphql-query'

import {
    noticeFields,
    situationFields,
    lineFields,
    estimatedCallFields,
    intermediateEstimatedCallFields,
} from './queryHelper'

const journeyPatternFields = {
    id: true,
    name: true,
    line: lineFields,
    notices: noticeFields,
}

const serviceJourneyFields = {
    id: true,
    privateCode: true,
    linePublicCode: true,
    wheelchairAccessible: true,
    journeyPattern: journeyPatternFields,
    notices: noticeFields,
    situations: situationFields,
}

const quayFields = {
    id: true,
    publicCode: true,
    description: true,
}

const placeFields = {
    name: true,
    latitude: true,
    longitude: true,
    quay: {
        ...quayFields,
        name: true,
        situations: situationFields,
    },
}

const legFields = {
    mode: true,
    aimedStartTime: true,
    aimedEndTime: true,
    expectedStartTime: true,
    expectedEndTime: true,
    realtime: true,
    distance: true,
    duration: true,
    ride: true,

    fromPlace: placeFields,
    toPlace: placeFields,
    serviceJourney: serviceJourneyFields,
    line: lineFields,
    intermediateQuays: {
        id: true,
        name: true,
        description: true,
        publicCode: true,
    },
    intermediateEstimatedCalls: {
        ...estimatedCallFields,
        ...intermediateEstimatedCallFields,
    },

    pointsOnLink: {
        points: true,
        length: true,
    },
    authority: {
        id: true,
        name: true,
    },
    operator: {
        id: true,
        name: true,
        url: true,
    },
}

export const getTripPatternQuery = {
    query: {
        __variables: {
            numTripPatterns: 'Int!',
            from: 'Location!',
            to: 'Location!',
            dateTime: 'DateTime!',
            arriveBy: 'Boolean!',
            wheelchair: 'Boolean!',
            modes: '[Mode]!',

        },
        trip: {
            __args: {
                numTripPatterns: new VariableType('numTripPatterns'),
                from: new VariableType('from'),
                to: new VariableType('to'),
                dateTime: new VariableType('dateTime'),
                arriveBy: new VariableType('arriveBy'),
                wheelchair: new VariableType('wheelchair'),
                modes: new VariableType('modes'),
            },
            tripPatterns: {
                startTime: true,
                endTime: true,
                duration: true,
                waitingTime: true,
                walkDistance: true,
                legs: legFields,
            },
        },
    },
}

const departureFields = {
    ...estimatedCallFields,
    aimedDepartureTime: true,
    expectedDepartureTime: true,
    realtime: true,
    situations: situationFields,
    quay: quayFields,
    serviceJourney: {
        ...serviceJourneyFields,
        line: {
            ...lineFields,
            transportMode: true,
            description: true,
        },
    },
}

export const getDeparturesForStopPlacesQuery = {
    query: {
        __variables: {
            ids: '[String]!',
            start: 'DateTime!',
            timeRange: 'Int!',
            limit: 'Int!',
            omitNonBoarding: 'Boolean!',
        },
        stopPlaces: {
            __args: {
                ids: new VariableType('ids'),
            },
            id: true,
            estimatedCalls: {
                __args: {
                    startTime: new VariableType('start'),
                    timeRange: new VariableType('timeRange'),
                    numberOfDepartures: new VariableType('limit'),
                    omitNonBoarding: new VariableType('omitNonBoarding'),
                },
                ...departureFields,
            },
        },
    },
}
                },
            },
        },
    },
}
