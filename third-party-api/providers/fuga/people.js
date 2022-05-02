const createError = require('http-errors');
const { axiosFugaV2Instance } = require('../../../config/axiosConfig');
const { deleteWeirdCharacters } = require('../../../utils/utils');

const { get, post } = axiosFugaV2Instance;

const getAllPeopleFuga = async () => {
  const response = await get('/people');
  return response;
}

const getPersonByNameFuga = async personName => {
  let cleanedName = deleteWeirdCharacters(personName.toLowerCase());
  const personsThatCoincidInitName = await get(`/people?name=${cleanedName}`);
  return personsThatCoincidInitName;
}

const getPeopleByIdFuga = async personId => {
  const response = await get(`/people/${personId}`);
  return response;
}

const checkIfErrorIsDuplicatedNameAndAct = async (errorCreatingPerson, personName) => {
  if (errorCreatingPerson.data.code === "DUPLICATE_PERSON_NAME") {
    const allPersonsWhoInitWithThatName = await getPersonByNameFuga(personName);
    return {
      data: allPersonsWhoInitWithThatName.data.person.find(person =>
        deleteWeirdCharacters(person.name.toLowerCase()) === deleteWeirdCharacters(personName.toLowerCase()))
    };
  }
  else throw createError(400, errorCreatingPerson.data.message, { config: { url: "/people" }, response: { data: { unexpectedError: true } } });
}

const createPersonFuga = async rawDataPerson => {
  const response = await post('/people', rawDataPerson)
    .catch(async error => await checkIfErrorIsDuplicatedNameAndAct(error.response, rawDataPerson.name))
  return response;
}

const createMultiplePersonsFuga = async personsNames => {
  const people = JSON.parse(personsNames.names);
  let personsResult = [];

  for (const personName of people) {
    if (personName.name) {
      const responseCreatePerson = await createPersonFuga(personName);
      personsResult.push(responseCreatePerson.data);
    }
  }

  return personsResult.filter(person => person !== "EMPTY NAME");
}

module.exports = { getAllPeopleFuga, getPeopleByIdFuga, createPersonFuga, createMultiplePersonsFuga, getPersonByNameFuga };