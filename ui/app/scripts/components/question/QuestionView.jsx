// Lib imports
import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';

// App imports
import AnswerStore from '../../stores/answer';
import EditorText from '../common/EditorText';
import QuestionStore from '../../stores/question';
import CONSTANTS from '../../services/constants';
import SessionStore from '../../stores/session';


class Answer extends React.Component {
    render() {
        const { type } = this.props;
        var tags;
        var user;
        var date;
        if (type === 'question') {
            date = moment(this.props.question.created_at).format(CONSTANTS.DATETIME_FORMAT);
            user = this.props.question.user.firstname + ' ' + this.props.question.user.lastname;
            tags = this.props.question.tags.map(tag => {
                return (
                    <li>{tag}</li>
                );
            });
        } else {
            date = moment(this.props.answer.created_at).format(CONSTANTS.DATETIME_FORMAT);
            user = this.props.answer.user.firstname + ' ' + this.props.answer.user.lastname;
        }
        return (
            <div className={`content-format ${type === 'question' ? 'question-type' : 'answer-type'}`}>
                <div className="left-vote">
                    <div><i className={'fa fa-caret-up'} /></div>
                    <div>N/A</div>
                    <div><i className={'fa fa-caret-down'} /></div>
                </div>
                <div className="right-content">
                    {type === 'question' ?
                        <div dangerouslySetInnerHTML={{__html: this.props.question.body}} /> :
                        <div dangerouslySetInnerHTML={{__html: this.props.answer.message}} />
                    }
                    {type === 'question' ?
                        <div className="description-tags">
                            <ul>
                                {tags}
                            </ul>
                        </div> : null
                    }
                    <div>
                        <span className="description-footer">
                            {`${type === 'question' ? 'asked' : 'answered'}`} {date} <span className="description-user">{user}</span>
                        </span>
                    </div>
                    <div>
                        <span className="user-action">edit</span>
                    </div>
                </div>
            </div>
        );
    }
}

class Answers extends React.Component {
    render() {
        const answers = this.props.answers.map(answer => {
            return (
                <Answer key={answer.id} answer={answer} />
            );
        });
        return (
            answers.length > 0 ?
                <React.Fragment>
                    <div className="separator">
                        {answers.length} Answers
                    </div>
                    {answers}
                </React.Fragment> : null
        );
    }
}

class Question extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="question-title">
                    {this.props.question.title}
                </div>
                <Answer type="question" question={this.props.question} />
            </React.Fragment>
        );
    }
}

class Reply extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="separator your-reply">
                    Your Answer
                </div>
                <EditorText />
                <div className="post-button">
                    <Button bsStyle="primary">Post Your Answer</Button>
                </div>
            </React.Fragment>
        );
    }
}

@observer
class QuestionView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionId: this.props.match.params.id
        };
    }
    componentDidMount() {
        QuestionStore.loadAll();
        AnswerStore.loadAll(this.state.questionId);
    }
    render() {
        var canReply = SessionStore.user ? true : false;
        var question = QuestionStore.get(this.state.questionId);
        return (
            <div className="question-view">
                <div className="question-content-container">
                    {question ? <Question question={question} /> : null}
                    <Answers answers={AnswerStore.answers} />
                    {canReply ?
                        <Reply /> : null
                    }
                </div>
            </div>
        );
    }
}

export default QuestionView;
