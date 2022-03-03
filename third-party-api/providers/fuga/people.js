const createError = require('http-errors');
const { axiosFugaV2Instance } = require('../../../config/axiosConfig');

const { get, post } = axiosFugaV2Instance;

const getAllPeopleFuga = async () => {
  const response = await get('/people');
  return response;
}

const getPersonByNameFuga = async personName => {
  const personsThatCoincidInitName = await get(`/people?name=${encodeURI(personName)}`);
  return personsThatCoincidInitName;
}

const getPeopleByIdFuga = async personId => {
  const response = await get(`/people/${personId}`);
  return response;
}

const checkIfErrorIsDuplicatedNameAndAct = async (errorCreatingPerson, personName) => {
  if (errorCreatingPerson.data.code === "DUPLICATE_PERSON_NAME") {
    const allPersonsWhoInitWithThatName = await getPersonByNameFuga(personName);
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
  const people = JSON.parse(personsNames.names);
  const createPersons = people.map(async person => {
    if (!person.name) return "EMPTY NAME";
    const responseCreatePerson = await createPersonFuga(person);
    return responseCreatePerson.data;
  })

  return Promise.all(createPersons).then(result => result.filter(person => person !== "EMPTY NAME")).catch(error => error);
}

module.exports = { getAllPeopleFuga, getPeopleByIdFuga, createPersonFuga, createMultiplePersonsFuga, getPersonByNameFuga };