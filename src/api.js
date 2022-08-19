const apiUrl = process.env.API_URL;

//Assignment1 functions 
export async function getUserFragments(user, expand=0) {
  console.log('Requesting user fragments...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=${expand}`, {
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments', { data });
    return { data };
  } catch (err) {
    console.error('Unable to call GET /v1/fragments', { err });
  }
}

export async function getFragmentById(user, id, ext='') {
  console.log(`Get Fragment By Id called`);
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}${ext}`, {
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      const error = await res.json();
      throw error.error?.message || res.statusText;
    }
    console.log('Got fragments data with given id', res);
    const contentType = res.headers.get('content-type');


    if (contentType.startsWith('text/')) {
      try {
        return { contentType, data: await res.text() };
      } catch (e) {
        console.error('cannot return fragment', { e });
      }
    } else if (contentType.startsWith('application/json')) {
      try {
        return { contentType, data: await res.json() };
      } catch (e) {
        console.error('cannot return fragment', { e });
      }      
    } else if (contentType.startsWith('image/')) {
      try {
        const myBlob = await res.blob();
        return { contentType, data: myBlob };
      } catch (e) {
        console.error('cannot return fragment', { e });
      } 
    }
  } catch (err) {
    console.error('Unable to call GET /v1/fragments/:id', { err });
    throw new Error(err);
  }
}

//Assignment2 function
export async function getFragmentInfoById(user, id) {
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}/info`, {
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      const error = await res.json();
      throw error.error?.message || res.statusText;
    }
    const data = await res.json();
    console.log('Got fragment', { data });
    return data;
  } catch (err) {
    console.error('Unable to call GET /v1/fragments/:id', { err });
    throw new Error(err);
  }
}

export async function postFragment(user, value, contentType) {
  console.log('PostFragment vcalled');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.idToken}`,
        'Content-Type': contentType,
      },
      body: value,
    });
    if (!res.ok) {
      const error = await res.json();
      throw error.error?.message || res.statusText;
    }
    const data = await res.json();
    console.log('Posted new fragments', { data });
    return data;
  } catch (err) {
    console.error('Unable to call POST /v1/fragments', { err });
    throw new Error(err);
  }
}

export async function deleteFragment(user, id) {
  console.log('DeleteFragment Called');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Deleted fragment', { data });
    return data;
  } catch (err) {
    console.error('Unable to call DELETE /v1/fragments', { err });
  }
}

export async function updateFragment(user, value, id, contentType) {
  console.log('UpdateFragment Callled');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.idToken}`,
        'Content-Type': contentType,
      },
      body: value,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Updated fragment', { data });
    return data;
  } catch (err) {
    console.error('Unable to call PUT /v1/fragments', { err });
  }
}