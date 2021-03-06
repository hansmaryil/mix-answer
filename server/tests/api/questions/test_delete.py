from core.db.models import Question
from core.db.models import User

from tests.base import AuthAppTestCase

URI = '/questions/{id}'


class TestWithInvalidParams(AuthAppTestCase):

    def test_with_invalid_id(self):

        # Call
        response = self.fetch(URI.format(id=0), method='DELETE')
        body = self.response_dict(response)

        # Check response
        self.assertEqual(404, response.code)
        self.assertEqual('No Question with id 0', body['error']['message'])


class TestWithValidParams(AuthAppTestCase):

    def setUp(self):

        super().setUp()
        u = User(firstname='Fernando', lastname='Alonso', email='fernando.alonso@mclaren.com')
        self.question = Question(title='Title', body='Body', user=u, creator_id=self.request_user.id)
        self.db.add(u)
        self.db.add(self.question)
        self.db.commit()

    def tearDown(self):
        self.db.query(Question).delete()
        self.db.query(User).delete()
        self.db.commit()
        super().tearDown()

    def test_delete(self):

        # Call
        response = self.fetch(URI.format(id=self.question.id), method='DELETE')

        # Check status code
        self.assertEqual(204, response.code)

        # Check in DB
        alert = self.db.query(Question).get(self.question.id)
        self.assertEqual(None, alert)
