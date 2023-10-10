import { assign, createMachine, raise } from 'xstate';
import { v4 as uuidv4 } from 'uuid';
import {getRandomArguments, getRandomVotes} from '../helpers/generators';

const existingArgsIds = [];

export const brainstormMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QCMBOBDAlgO1gFwHtUBbAOh3QGM9MA3MAYgGUAVAQQCUWBtABgF1EoAA4FYmGgWxCQAD0QBGAKwBmUgCZeKheoDsChSt0AWY4YA0IAJ6IVSgJyl76+7u0LeqpbwUBfX5ZoWLiEJKRUNPQMAGIAkgBysUwAEnyCSCCi4pLSGfIIOuoAbKTaRca6RbzGSuouRZY2CEW6jlX2KgAcneqqCvpF-oEYOPhEZBF0jABqAPIsAKJpMlkSmFIy+ZW8pLydxrzq+8YunTqNiGekxva39kpF9t3V6n4BIEGjoRPUU8wL8QAIgB9TgAcQAqgBZAE8AQrMRrDZ5WyeXbadQHMqeR4XBAqTHXPonXjlFy8ezGIYfEYhcbhX70UhgejYPCwMFgbBgDA0bBQBhggELDhsRagjiQmHxOHpESInKbRBHBSkDwdXRKPH6XSkToOFT2IpFXqU6mfOlhSZMmjEHkMFixADCAGllhlVoqUQgjrrbrUDkV9t59So8cZ9rt9soDZVKoN3haxlbGWBSLb7e75dl1rlQPlCiUyhUqjU6ka8UUVGp2oaHLcioYlObacmfpE08JUAQoKg4OJ+aQAO5YPkCtiAkHg6GwrOZBW5pUIXQUvUtfpKTr2AytLXWRBmJTXUkubT2Q4KVwt4Jthkd0hdnt92ADqDD1BrflsVBQACudrZf4WAlKVZ3hD0F2RfNEFcVU3E6AkjiUfQlFUPEyicPotxcWpiWvL56WtTtu17fscDfIcPzHb8-wAvBmBYWYAAVQUnBIwRAmcZTnT1F29FdHE6ddNS3Hd7nQ8onFJbQel6YwVFMfx3mwAgIDgGQk2+BEcyguREAAWgrfcEH0kpeHM8ylAUKtPC0Al8MtMgKFTbSkTzPSEBOCSdhOVx3E8OwfAc28iNcr1oJMiM8QUMxMJkzUUNMQ5gu+O8pmZVl2U5bleXIsK+Ii3htWqUoDSNE0HCpRNW1Soj00wO1UHy3T8m0HYtB0LFrJxexKz2UqOnK00quGG9atTB8SOfV9mvc-IlBuUhyhPCoG2MBpjPLIkZP2atDX1XQUsIibH1Il9yOHUc8ognS5sQBxdWWk1VqNdbw14XVZPuTcjHkvQjpTe9Tumi7KM-KAaP-Lk8Fmpc-LVZa3ApBS9mMcMFE6Y8qxOBTXgeQ7qrG+kADMcEwWAAAtIFh70Wjxb69QNTpKmKYM3n8IA */
    predictableActionArguments: true,
    id: 'brainstorm',
    initial: "inactive",
    context: {
        numberOfParticipants: 1000,
        arguments: [],
        newPro: '',
        newCon: '',
        timer: 300000,
    },
    states: {
        inactive: {
            on: {
                START: "active"
            }
        },
        active: {
            type: 'parallel',
            states: {
                eventsGenerating: {
                    invoke: {
                        src: () => (callback) => {
                            const interval = setInterval(() => {
                                callback('GENERATE_ARGUMENTS');

                                // setTimeout(() => {
                                //     console.log('getg sfse')
                                //     cb('GENERATE_VOTES');
                                // }, 200);
                            }, 1200);

                            return () => {
                                clearInterval(interval);
                            };
                        }
                    },
                    on: {
                        GENERATE_ARGUMENTS: {
                            actions: raise(() => {
                                console.log('raise receive args');

                                return ({
                                    type: 'RECEIVE_ARGUMENTS',
                                    data: {
                                        arguments: getRandomArguments()
                                    }
                                });
                            }),
                        },
                        GENERATE_VOTES: {
                            actions: raise(() => {
                                console.log('raise receive votes');
                                return (
                                    {
                                        type: 'RECEIVE_VOTES',
                                        data: {
                                            votes: getRandomVotes(existingArgsIds)
                                        }
                                    });
                            }),
                        },
                    }
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
                    }
                },
            },
            on: {
                FINISH: "finished",
                VOTE: {
                    actions: "sendVote",
                    target: "active",
                    internal: true
                },
                SEND_ARGUMENT: {
                    actions: 'sendArgument',
                    target: "#brainstorm.active.progressing",
                    // cond: (context, event) => {
                    //     if (event.data.type === 'pros') {
                    //         return !!context.newPro;
                    //     }

                    //     return !!context.newCon;
                    // },
                },
                RECEIVE_ARGUMENTS: {
                    actions: 'receiveArguments',
                    target: "#brainstorm.active.progressing",
                },
                RECEIVE_VOTES: {
                    actions: 'receiveVotes',
                    target: "#brainstorm.active.progressing",
                },
            }
        },
        finished: {
            type: "final"
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
            receiveVotes: assign((context, event) => {
                console.log(event.data.votes);
                event.data.votes.forEach(vote => {
                    const newArgs = context.arguments.map(arg => {
                        if (arg.id === vote.argId) {
                            return {
                                ...arg,
                                ...(vote.type === 'like'
                                    ? ({likes: arg.likes + 1})
                                    : ({dislikes: arg.dislikes + 1}))
                            }
                        }

                        return arg;
                    });

                    return {
                        arguments: newArgs,
                    };
                })
            }),
            receiveArguments: assign((context, event) => {
                return {
                    arguments: [...context.arguments, ...event.data.arguments],
                };
            })
        }
    }
);
