const createError = require('http-errors');
const { axiosFugaV2Instance } = require('../../../config/axiosConfig');

const { get, post } = axiosFugaV2Instance;

const getAllPeopleFuga = async () => {
  const response = await get('/people');
  return response;
}

const getPersonByName = async personName => {
  const personsThatCoincidInitName = await get(`/people?name=${personName}`);
  console.log("PERSONS THATH COINCID: ", personsThatCoincidInitName.data.person);
  return personsThatCoincidInitName;
}

const getPeopleByIdFuga = async personId => {
  const response = await get(`/people/${personId}`);
  return response;
}

const checkIfErrorIsDuplicatedNameAndAct = async (errorCreatingPerson, personName) => {
  if (errorCreatingPerson.data.code === "DUPLICATE_PERSON_NAME") {
    const allPersonsWhoInitWithThatName = await getPersonByName(personName);
    return { data: allPersonsWhoInitWithThatName.data.person.find(person => person.name.toLowerCase() === personName.toLowerCase()) };
  }
  else throw createError(400, errorCreatingPerson.data.message, { config: { url: "/people" }, response: { data: { unexpectedError: true } } });
}

const createPersonFuga = async rawDataPerson => {
  const response = await post('/people', rawDataPerson)
    .catch(async error => await checkIfErrorIsDuplicatedNameAndAct(error.response, rawDataPerson.name))
  return response;
}

const createMultiplePersonsFuga = async personsNames => {
  console.log("PEOPLE: ", personsNames);
  const people = JSON.parse(personsNames.names);
  const createPersons = people.map(async person => {
    const responseCreatePerson = await createPersonFuga(person);
    return responseCreatePerson.data;
  })

  return Promise.all(createPersons).then(result => result).catch(error => error);
}

module.exports = { getAllPeopleFuga, getPeopleByIdFuga, createPersonFuga, createMultiplePersonsFuga };