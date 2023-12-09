
import { gql, useMutation, useQuery } from "@apollo/client";
import prisma from "../lib/prisma";

const typeDefs = gql`
  mutation createUser($id: String, $email: String, $name: String, $role: Int) {
    createUser(id: $id, email: $email, name: $name, role: $role) {
      id
      email
      name
      role
    }
  }
`;

export function CreateUser(user: any){
  const [newUser, {error}] = useMutation(typeDefs, {
    variables: { id: user.uid, email: user.email, name: user.displayName, role: 3 },
  });
  if(error){
  console.log(error);
  }
}

