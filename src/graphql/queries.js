// eslint-disable
// this is an auto generated file. This will be overwritten

export const getCity = `query GetCity($id: ID!) {
  getCity(id: $id) {
    id
    name
    description
    location
  }
}
`;
export const listCitys = `query ListCitys(
  $filter: ModelCityFilterInput
  $limit: Int
  $nextToken: String
) {
  listCitys(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      description
      location
    }
    nextToken
  }
}
`;
