// src/api.js

// fragments microservice API, defaults to localhost:8080
//  'http://localhost:8080'

const api = process.env.API_URL;

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */

export async function getUserFragments(user) {
  console.log('Get fragments data...');
  try {
    const res = await fetch(`${api}/v1/fragments`, {
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('User fragments data', { data });
    return { data };
  } catch (err) {
    console.error('Cant GET /v1/fragments', { err });
  }
}

//Get by id
export async function getFragmentById(user, id) {
  console.log(`Requesting fragment by id ${id}`);
  try {
    const res = await fetch(`${api}/v1/fragments/${id}`, {
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Fragment with id', { data });
    return { data };
  } catch (err) {
    console.error('Cant GET /v1/fragments/:id', { err });
  }
}

export async function postFragment(user, value) {
  console.log('Post fragment data...');
  try {
    const res = await fetch(`${api}/v1/fragments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
      body: value,
    });
    if (!res.ok) {
      throw new Error(`{res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Posted fragments data', { data });
  } catch (err) {
    console.error('Unable to call POST /v1/fragments', { err });
  }
}

