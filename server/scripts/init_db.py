import argparse
import logging
import sys

from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import scoped_session
from sqlalchemy.orm import sessionmaker

from core.db.models import Answer
from core.db.models import Base
from core.db.models import Question
from core.db.models import Tag
from core.db.models import User
from core.db.models import Vote

from core.utils.config import parse_config

logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)


def main(argv=sys.argv):

    # Parse arguments
    parser = argparse.ArgumentParser(description='Init DB')
    parser.add_argument('-c', '--config', dest='config', required=True)
    parser.add_argument('-t', '--data_test', dest='data_test', required=False, default=False)
    args = parser.parse_args()
    if not args.config:
        parser.print_help()
        sys.exit(1)

    # Get config
    config = parse_config(args.config)

    # Drop db
    engine = create_engine_db(config)
    Base.metadata.drop_all(engine)

    # Init DB
    db = initdb(config)

    # Add data test
    if args.data_test in ['true', True, 1]:
        add_data_test(db)


def drop_db(config):
    db_engine = create_engine_db(config)
    db = scoped_session(sessionmaker(bind=db_engine, autoflush=True))
    db.drop_all()


def create_engine_db(config):
    db_url = config.get('sqlalchemy', 'url')
    return create_engine(db_url, echo=True)


def initdb(config):
    db_engine = create_engine_db(config)

    try:
        logging.info('Creating the database schema')
        Base.metadata.create_all(db_engine)
    except OperationalError as e:
        logging.exception('Unable to connect to the database')
    else:
        logging.info('Successfully initialized the database')
    
    return scoped_session(sessionmaker(bind=db_engine, autoflush=True))


def add_data_test(db):

    # Add users
    u1 = User(firstname="Fernando", lastname="Alonso", email="fernando.alonso@mclaren.com")
    u2 = User(firstname="Kimi", lastname="Raikkonen", email="kimi.raikkonen@ferrari.it")
    db.add(u1)
    db.add(u2)

    # Add tags
    t1 = Tag(label='JavaScript')
    t2 = Tag(label='ReactJS')
    t3 = Tag(label='Weekend')
    t4 = Tag(label='Setup')
    t5 = Tag(label='Docker')
    db.add(t1)
    db.add(t2)
    db.add(t3)
    db.add(t4)
    db.add(t5)

    # Add answers
    a1 = Answer(message='Mix Answer has been setup to work with Docker. You just need to install Docker on your machine and follow the instruction, it\'s as easy as that.', user=u2)
    a2 = Answer(message='I confirm, just follow the instructions, it\'s so easy.', user=u2)
    a3 = Answer(message='There are a lot of popular frameworks today so it\'s difficult to choose. I can recommend you ReactJS, this is the tool used for Mix Answer', user=u1)
    db.add(a1)
    db.add(a2)
    db.add(a3)
    db.flush()

    # Add questions
    db.add(Question(title='How do you setup Mix Answer?', body='I\'m trying to install Mix Answer, what tool do I need?', user_id=u1.id, answers=[a1, a2], tags=[t4, t5]))
    db.add(Question(title='What is the best front-end technology?', body='I\'d like to create a website but I don\'t know which framework to use', user_id=u1.id, answers=[a3], tags=[t1, t4, t5]))
    db.add(Question(title='What did you plan for this weekend?', body='What are you planning to do this weekend?', user_id=u2.id, tags=[t3]))

    # Add votes
    v1 = Vote(answer_id=a1.id, user_id=u1.id)
    v2 = Vote(answer_id=a1.id, user_id=u2.id)
    db.add(v1)
    db.add(v2)

    # Commit data
    db.commit()


if __name__ == '__main__':
    main()
