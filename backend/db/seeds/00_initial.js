const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Knex = require('knex');
const tableNames = require('../../src/constants/tableNames');
const countries = require('../../src/constants/countries');
const us_states = require('../../src/constants/us_states');
const ca_provinces = require('../../src/constants/ca_provinces');

/**
 * @param {Knex} knex 
 */
exports.seed = async (knex) => {

    await Promise.all(Object.keys(tableNames).map((name) => knex(name).del()));

    const password = crypto.randomBytes(15).toString('hex');

    const user = {
        email: 'cmh001@clintenhopkins.com',
        name: 'Clint',
        password: await bcrypt.hash(password, 12),
    }

    const [createdUser] = await knex(tableNames.user)
        .insert(user)
        .returning('*');

    if (process.env.NODE_ENV !== 'test') {
        console.log(
            'User created:',
            {
            password,
            },
            createdUser
        );
    }
    
    const insertedCountries = await knex(tableNames.country).insert(
        countries,
        '*'
    );


    const usa = insertedCountries.find((country) => country.code === 'US');
    const ca = insertedCountries.find((country) => country.code === 'CA');

    us_states.forEach((state) => {
        state.country_id = usa.id;
    });

    ca_provinces.forEach((state) => {
        state.country_id = ca.id;
    });

    await knex(tableNames.subnationalDivision).insert(us_states);
    await knex(tableNames.subnationalDivision).insert(ca_provinces);
};
