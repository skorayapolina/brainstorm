import { ReactComponent as LikeIcon } from '../../icons/like.svg';
import './ArgumentsList.css';

export const ArgumentsList = ({
    args,
    onVoteClick,
    maxLikesValue,
    isVoteControlsShown,
}) => {
    return (
        <ul className="arguments-list">
            {args.map((arg) => (
                <li key={arg.id} className="arguments-item">
                    <div>{arg.value}</div>
                    <div className="votes">
                        <div className="votes-value">{arg.likes} / - {arg.dislikes}</div>
                        {isVoteControlsShown && (
                            <div className="vote-controls">
                                <button
                                    className='button button-vote button--dislike'
                                    onClick={() => onVoteClick({
                                        argId: arg.id,
                                        type: 'dislike'
                                    })}
                                >
                                    <LikeIcon className="icon--dislike"/>
                                </button>
                                <button
                                    className='button button-vote button--like'
                                    onClick={() => onVoteClick({
                                        argId: arg.id,
                                        type: 'like'
                                    })}
                                >
                                    <LikeIcon/>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="scale">
                        <div className="scaleValue" style={{ width: `${(arg.likes * 100) / maxLikesValue}%` }} />
                    </div>
                </li>
            ))}
        </ul>
    );
}
