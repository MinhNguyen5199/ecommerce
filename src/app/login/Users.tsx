import { gql, useMutation, useQuery } from '@apollo/client';
export const CreateUser = gql`
  mutation createUser($id: String!, $email: String!, $name: String!, $role: Int!) {
    createUser(id: $id, email: $email, name: $name, role: $role) {
      id
      email
      name
      role
    }
  }
`
export const findAllUsers = gql`
  query {
    findAllUsers {
      email
    }
  }
`