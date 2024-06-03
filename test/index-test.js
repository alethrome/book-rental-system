//process.env.PORT = 5000; // Use a different port for testing

const supertest = require('supertest');
const expect = require('chai').expect;
let response;


// chai.use(chaiHttp);
// chai.should

describe('Book API', () => {
it('It should GET all the tasks', async() => {
    response = await supertest('https://book-rental-system-svo5.onrender.com')
        .get('/book/all')
        //.set('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDk0OGI2Mi1kMWEyLTQyNzctODNmZS01ZDBjYWNmZmM0ZGQiLCJpYXQiOjE3MTcwNDAyODEsImV4cCI6MTcxNzA0MDU4MX0.SfcTozgcgCE8jePcfz8db06HsHYTeoQBRx6sVjC15uU1eAjuOX38HsAZFZY8YET3RZtdCWSZ5_KedtGhwYUXyiMsEfc6wLmupSQVF132DBgJGAd_xzoDbi_Cya2CAFPcGOpm5-33QnsjCDQ0XQHxvVUwD6DNgSm557tgpoS__YW86dYmh-Ze23rp5DTN0FUzAsG3EiHOR1Le0-7KbpMTLkjvSxAdV1o2CAp07hoNHnW4QzlqVt79hfrriXwkfXy13W4nyGCDO4nErYLkrpD47J7Dlk5BVTm_yytzXqdfNOoilawomD_X3SjvPpZgU1LPryUQMbq2ct9B3HfIt0aczQ')
        // .then(response => {
        //     return response;
        // });

    expect(response.status).to.be.equal(200);
    expect(response.body.length).to.be.equal(1);
    });
});