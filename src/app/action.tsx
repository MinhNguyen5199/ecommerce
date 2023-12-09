'use server'
 
import { cookies } from 'next/headers'
 
export async function create(data:any) {
  
  cookies().set('user', data.findUser.role, { expires: Date.now() + 1000 * 60 * 60 * 24 * 365 })
}

export async function createAdmin() {
    
  cookies().set('user', "1", { expires: Date.now() + 1000 * 60 * 60 * 24 * 365 })
}

export async function readRole() {
  const role = await cookies().get('user');
  return role;
}

export async function deleteCookie() {
  cookies().delete('user');
}