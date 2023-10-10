import {assign, createMachine} from 'xstate';
import { v4 as uuidv4 } from 'uuid';
import {getRandomArguments, getRandomVotes} from '../helpers/generators';

let areEventsReceived = false;
let eventsShelf = [];
const existingArgsIds = [];

export const brainstormMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QCMBOBDAlgO1gFwHtUBbAOh3QGM9MA3MAYgGUAVAQQCUWBtABgF1EoAA4FYmGgWxCQAD0QBGAKwBmUgCZeKhQoBsATl779K9QBYANCACeifbrUB2ABxLdS9YbMLHPgL5+VmhYuIQkpFQ09AwAYgCSAHJxTAASfIJIIKLiktKZ8gj6LqSOvAYquo5KzmaGKla2hfrqGq667fYKZuouAUEYOPhEZJF0YKRg9Nh4sADiYNhgGDTYUAwcAKIAwhtxAGobAPobBwksTOky2RKYUjIFSkoKpNrOKryOjupKjrpmug1EKUlCUFLwFOpnM4FKZHuo+iBgoMwiNqGNSDRiEsGCw4lsANKXTLXXL3RDQ5ykZTqcxVMyqapKQEIVyUlSwlSPapQz4IpGhYYRNH0DGYLGoBhEkRiG53fJ2YqlcqVaq1LTM-RmSmQtwqIoedTveGBREDAXhUYi4SoAhQVBwcSrZgbBIAEUOnFmAFUALIungCK4y0nyhC1Fr-XjqZTuLymeo2RDmXSkXRaVxKXi8MyfaFKPlmoYW4Xja22+2wR1rPYAeRYGylWWDtzyoAKvzML3BWdUCmc5l4TMTCENz30ec+kYMjn0BZCRdRUVLNrtDpwUFIAHcsCs1mxXe7Pb7-Y2SS2yWGPBofv2vrVPprLMO3C1nDPvGVM+5dMb+vOUUKS6kGWq6VuuW6oDcqxsKgUAAK5YtMzosB6HDen6Zyns2cptkCXRUpCzhptG0ZGsy-xqN0P6GM01Q6PmJr8gugHoiBFZVhBUFQDB8GIXgzAsDWAAKHoHoksyoehJ6BsS2GtnIiD0i03wuD05hFO+T6NE8LQqO+n6eLozgmAEJrYAQEBwDITEokGOTnqGAC0ALDs5r6dPSUb0q4JmMYWAEUCWdmyvJBTdBqfytG4HheD4-h+f+gqWmAwUhrhI5mJ2WgQnRfztD8zLmKm6Y5pGZgfERKhzsiSUlhMUwzPMizLOuqUOel2i8KQ2XfNCeXuI4zK-JSPg5nqMJpga1Xmou6KYksbU4QpCCdd12i9Xo-wDRqPwlG0WrsoOOa-qaiXFkBbFrqsi2hUmzRrTlfVbQVw7KPoVLpnqUIMm+DF-jV52sSu7HgduXE3ReKjlQ9G39S92lKJ2hm8M44L9qog7TcxyXAcDV0bpukG7jxCELHgEOhr4IKPP8tSmPoHjOMybidm+mqvDo46mFjAEAGY4JgsAABaQBT6WVMyMKDlF7RvW+P4MQEQA */
    predictableActionArguments: true,
    id: 'brainstorm',
    initial: "inactive",
    context: {
        numberOfParticipants: 1000,
        arguments: [],
        newPro: '',
        newCon: '',
        timer: 300000,
        intervals: [],
    },
    states: {
        inactive: {
            on: {
                START: "active"
            }
        },
        active: {
            type: 'parallel',
            exit: 'stopEventsGeneration',
            states: {
                eventsGenerating: {
                    entry: 'generateEvents',
                    invoke: {
                        src: () => (callback) => {
                            const interval = setInterval(() => {
                                callback('RECEIVE_EVENTS');
                            }, 1000);

                            return () => {
                                clearInterval(interval);
                            };
                        }
                    },
                    on: {
                        RECEIVE_EVENTS: {
                            target: 'eventsGenerating',
                            actions: 'receiveEvents'
                        },
                    },
                },
                timer: {
                    always: {
                        target: '#brainstorm.finished',
                        cond: (context) => (context.timer <= 0)
                    },
                    invoke: {
                      src: () => (callback) => {
                        const interval = setInterval(() => {
                            callback('TICK');
                        }, 1000);

                        return () => {
                          clearInterval(interval);
                        };
                      }
                    },
                    on: {
                      TICK: {
                        actions: assign((context) => ({
                            timer: context.timer - 1000
                        }))
                      }
                    }
                },
                progressing: {
                    initial: 'waiting',
                    states: {
                        waiting: {
                            on: {
                                ADD_ARGUMENT: "writingArgument",
                            },
                        },
                         writingArgument: {
                            on: {
                                SET_ARGUMENT: {
                                    actions: 'setArgument',
                                },
                                STOP_ADDING_ARGUMENT: 'waiting',
                            },
                        }
                    },
                    on: {
                        SEND_ARGUMENT: {
                            actions: 'sendArgument',
                            target: ".writingArgument"
                        },
                        VOTE: {
                            actions: "sendVote",
                            target: "progressing",
                            internal: true
                        }
                    }
                },
            },
            on: {
                FINISH: "finished",
            }
        },
        finished: {
            type: "final",
        }
    },
}, {
        actions: {
            sendVote: assign((context, event) => {
                const newArgs = context.arguments.map(arg => {
                    if (arg.id === event.data.argId) {
                        return {
                            ...arg,
                            ...(event.data.type === 'like'
                                ? ({likes: arg.likes + 1})
                                : ({dislikes: arg.dislikes + 1}))
                        }
                    }

                    return arg;
                });

                return {
                  arguments: newArgs,
                };
            }),
            sendArgument: assign((context, event) => {
                const newArg = {
                    ...event.data,
                    id: uuidv4(),
                    likes: 0,
                    dislikes: 0,
                }

                existingArgsIds.push(newArg.id);

                return {
                  ...(event.data.type === 'pros'
                    ? { newPro: '' }
                    : { newCon: '' }),
                  arguments: [...context.arguments, newArg],
                };
            }),
            setArgument: assign((context, event) => event.data),
            generateEvents: (context) => {
                if (areEventsReceived) {
                    eventsShelf = [];
                }

                if (!!context.intervals.length) {
                    return;
                }

                // const argsInterval = setInterval(() => {
                //     areEventsReceived = false;
                //     eventsShelf.push(...getRandomArguments());
                // }, 1200);
                //
                // const votesInterval = setInterval(() => {
                //     if (existingArgsIds.length > 0) {
                //         areEventsReceived = false;
                //         eventsShelf.push(...getRandomVotes(existingArgsIds));
                //     }
                // }, 1000);

                // context.intervals.push(argsInterval, votesInterval)
            },
            receiveEvents: assign((context) => {
                const [argumentsEvents, votesEvents] = eventsShelf.reduce(([argumentsEvents, votesEvents], event) => {
                    if (event.eventType === 'votes') {
                        votesEvents.push(event);
                    } else {
                        argumentsEvents.push(event);
                    }

                    return [argumentsEvents, votesEvents];
                }, [[], []]);

                const [newArguments, newArgumentsIds] = argumentsEvents.reduce(([newArguments, newArgumentsIds], argEvent) => {
                    newArguments.push(argEvent.argument);
                    newArgumentsIds.push(argEvent.argument.id);

                    return [newArguments, newArgumentsIds]
                }, [[], []]);

                const argumentsWithVotes = context.arguments.map(arg => {
                    const votes = votesEvents.find(vote => vote.id === arg.id);

                    if (votes) {
                        return {
                            ...arg,
                            likes: arg.likes + votes.likes,
                            dislikes: arg.dislikes + votes.dislikes,
                        }
                    }

                    return arg;
                })

                areEventsReceived = true;
                existingArgsIds.push(...newArgumentsIds);

                return {
                    arguments: [...argumentsWithVotes, ...newArguments],
                };
            }),
            stopEventsGeneration: (context) => {
                console.log('stop');
                // context.intervals.forEach((intId) => {
                //     clearInterval(intId);
                // })
            }
        }
    }
);
