import { useCallback, useMemo } from 'react';
import { useMachine } from '@xstate/react';
import { brainstormMachine } from './machines/brainstormMachine';
import { getTime } from './helpers/helpers';
import { ReactComponent as LikeIcon } from './icons/like.svg';
import { ReactComponent as PlayIcon } from './icons/triangle.svg';
import { ReactComponent as SendIcon } from './icons/send.svg';
import './App.css';

function ArgumentsList({
    args,
    onVoteClick,
}) {
    return (
        <ul className="arguments-list">
            {args.map((arg) => (
                <li key={arg.id} className="arguments-item">
                    <div>{arg.value}</div>
                    <div className="votes">
                        <div className="votes-value">{arg.likes} / - {arg.dislikes}</div>
                        <div className="vote-controls">
                            <button
                                className='button button-vote button--dislike'
                                onClick={() => onVoteClick({
                                    argId: arg.id,
                                    type: 'dislike'
                                })}
                            >
                                <LikeIcon className="icon--dislike" />
                            </button>
                            <button
                                className='button button-vote button--like'
                                onClick={() => onVoteClick({
                                    argId: arg.id,
                                    type: 'like'
                                })}
                            >
                                <LikeIcon />
                            </button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

function ArgumentField({
    onFocus,
    onBlur,
    onChange,
    onClick,
    value,
    isSendShown,
}) {
    const onKeyDown = useCallback((event) => {
        if (event.which === 13 && !event.shiftKey) {
            if (!event.repeat) {
                onClick();
                event.preventDefault();
            }
        }
    }, [onClick]);

    return (
        <form className="field-form">
            <textarea
                onKeyDown={onKeyDown}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                className="field-textarea"
                placeholder="New argument"
            />
            {isSendShown && (
                <button
                    className="button button-send-argument"
                    onClick={onClick}
                >
                    <SendIcon />
                </button>
            )}
        </form>
    );
}

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
    }, [state.context.arguments])

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
                <div className="arguments">
                    {Object.entries(args).map(([key, args], index) => (
                        <div>
                            <h2 className="arguments-list-title">{key === 'pros' ? 'Pros:' : 'Cons:'}</h2>
                            <ArgumentsList
                                key={index}
                                args={args}
                                onVoteClick={(data) => (
                                    send({
                                        type: 'VOTE',
                                        data,
                                    })
                                )}
                            />
                        </div>
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
                        />
                    </>
                )}
            </main>
        </div>
    );
}

export default App;
