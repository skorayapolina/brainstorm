import { useMemo } from 'react';
import { useMachine } from '@xstate/react';
import { brainstormMachine } from './machines/brainstormMachine';
import { ArgumentField } from './components/ArgumentField/ArgumentField';
import {ArgumentsList} from './components/ArgumentsList/ArgumentsList';
import { getTime } from './helpers/time';
import { ReactComponent as PlayIcon } from './icons/triangle.svg';
import './App.css';

function App() {
    const [state, send] = useMachine(brainstormMachine);

    const args = useMemo(() => {
        return (
            state.context.arguments.reduce((acc, arg) => {
                if (arg.type === 'pros') {
                    acc.pros.push(arg);
                } else {
                    acc.cons.push(arg)
                }

                return acc;
            }, { pros: [], cons: [] })
        )
    }, [state.context.arguments]);

    // todo: replace with optimal algorithm
    const maxProsLikesValue = Math.max(...args.pros.map(pro => pro.likes));
    const maxConsLikesValue = Math.max(...args.cons.map(pro => pro.likes));

    return (
        <div className="app">
            <header className="header">
                <h1 className="title">Topic: TypeScript Pros and Cons</h1>
                {state.matches('inactive') && (
                    <button
                        className="button button--play"
                        onClick={() => send('START')}
                    >
                        <PlayIcon className="icon--play"/>
                    </button>
                )}
                <div className="time">
                    {getTime(state.context.timer)}
                </div>
            </header>
            <main className={`main ${state.matches('finished') && 'main--state-finished'}`}>
                <div className="arguments-header">
                    <h2 className="arguments-list-title">Pros:</h2>
                    <h2 className="arguments-list-title">Cons:</h2>
                </div>
                <div className="arguments">
                    {Object.entries(args).map(([key, args], index) => (
                        <ArgumentsList
                            key={key}
                            args={args}
                            onVoteClick={(data) => (
                                send({
                                    type: 'VOTE',
                                    data,
                                })
                            )}
                            maxLikesValue={key === 'pros' ? maxProsLikesValue : maxConsLikesValue}
                            isVoteControlsShown={state.matches('active')}
                        />
                    ))}
                </div>
                {state.matches('active') && (
                    <>
                        <ArgumentField
                            onFocus={() => send('ADD_ARGUMENT')}
                            onBlur={() => send('STOP_ADDING_ARGUMENT')}
                            onChange={(e) => send({
                                type: 'SET_ARGUMENT',
                                data: { newPro: e.target.value }
                            })}
                            onClick={() => (
                                send({
                                    type: 'SEND_ARGUMENT',
                                    data: { type: 'pros', value: state.context.newPro }
                                })
                            )}
                            value={state.context.newPro}
                            isSendShown={!!state.context.newPro}
                            placeholder="New Pro"
                        />
                        <ArgumentField
                            onFocus={() => send('ADD_ARGUMENT')}
                            onBlur={() => send('STOP_ADDING_ARGUMENT')}
                            onChange={(e) => send({
                                type: 'SET_ARGUMENT',
                                data: { newCon: e.target.value }
                            })}
                            onClick={() => (
                                send({
                                    type: 'SEND_ARGUMENT',
                                    data: { type: 'cons', value: state.context.newCon }
                                })
                            )}
                            value={state.context.newCon}
                            isSendShown={!!state.context.newCon}
                            placeholder="New Con"
                        />
                    </>
                )}
            </main>
        </div>
    );
}

export default App;
