import { Auth, getUser } from './auth';
import { getUserFragments, getFragmentById, getFragmentInfoById, postFragment, updateFragment, deleteFragment } from './api';

async function init() {

  //Handle user UI
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  loginBtn.onclick = () => {
    Auth.federatedSignIn();
  };

  logoutBtn.onclick = () => {
    Auth.signOut();
  };
  const user = await getUser();
  if (!user) {
    logoutBtn.disabled = true;
    return;
  }
  console.log({ user });
  await getUserFragments(user, 1);
  userSection.hidden = false;
  userSection.querySelector('.username').innerText = user.username;  
  loginBtn.disabled = true;

  //To figure it out which is which
  const current = document.querySelector('#current');
  const selectSection = document.querySelector('#type');
  const importSec = document.querySelector('#fileImport');
  const convertTypes = document.querySelector('#convertType');
  const mData = document.querySelector('#metadataSection');
  const ctype = document.getElementById('convertTypeForm');
  const img = document.getElementById('imageFragment');

  //Buttons
  const deleteBtn = document.getElementById('deleteBtn');
  const createBtn = document.getElementById('createBtn');

  const fDisplay = document.getElementById('fragment');
  const mDataDisplay = document.getElementById('metadata');

  let feautures = 'create';
  let theFragment = {};
  let selectedType = 'text/plain';


  //button implementations
  deleteBtn.onclick = async () => {
    try {
      const deleted = await deleteFragment(user, theFragment.id);
      if (deleted.status === 'ok') {
        alert('Fragment has been deleted.');
      }
      
    } catch (e) {
      console.log(e);
    }
  }

  createBtn.onclick = async () => {
    try {
      if (feautures === 'create') {
        fragment = await postFragment(user, e.target.result, f.type);
      } else {
        fragment = await updateFragment(user, e.target.result, theFragment.id, f.type);
      }
      if (fragment) {
          alert('Fragment has been added/updated');
     }
    } catch (e) {
      alert('There was a error');
    }
  }

  //GET ELEMENT ID DOM
  document.getElementById('existingFragments').addEventListener('change', function(e) {
    e.preventDefault();
    if (e.target.value === 'Select a fragment') {
      alert('Please select');
    } else {
      theFragment = JSON.parse(e.target.value);
      const selectedFragmentId = theFragment.id;
      selectedType = theFragment.type;
      console.log('selected fragment: ' + selectedFragmentId);
    }
  });
  document.getElementById('types').addEventListener('change', function(e) {
    e.preventDefault();
    selectedType = e.target.value;
    console.log('selected type: ' + selectedType);
  });

  const inputEl = document.getElementById('inputFile');
  inputEl?.addEventListener('change', handleFile);

  //async func
  function fillFragmentsOptions(fragments) {
    fragments.sort(function(a,b){
      return new Date(b.updated) - new Date(a.updated);
    });

    const select = document.getElementById('existingFragments');
    
    for (let i=0; i<fragments.length; i++) {
      const option = new Option();
      option.value = JSON.stringify({id: fragments[i].id, type: fragments[i].type});
      option.text = `${fragments[i].id}, ${fragments[i].type}`;
      select.appendChild(option);
    }
  }

  //DISPLAYING FEAUTUES
  async function displayFragment(id, selectedConversionType) {
    try {
      while (fDisplay.firstChild) {
        fDisplay.removeChild(fDisplay.firstChild);
      }
      fDisplay.innerText = '';
      img.src = '';
      const { contentType, data } = await getFragmentById(user, id, selectedConversionType);
      const metadata = await getFragmentInfoById(user, id);
      if (metadata) {
        mData.style.display = 'block';
        mDataDisplay.innerHTML = JSON.stringify(metadata);
      }
      if (contentType.startsWith('image/')) {
        img.src = URL.createObjectURL(data);  
      } else if (contentType.startsWith('text/html')) {
        fDisplay.insertAdjacentHTML('afterbegin',data);
      } else {
        fDisplay.innerText = typeof data === 'object' ? JSON.stringify(data) : data;
      }
    } catch (e) {
      alert('There was a error');
      mData.style.display = 'none';
    }
  }

  function removeFragmentsOptions() {
    const select = document.getElementById('existingFragments');
    while (select.lastChild.id !== 'default') {
      select.removeChild(select.lastChild);
    }
  }

  document.getElementById('features').addEventListener('change', async function(e) {
    e.preventDefault();
    feautures = e.target.value;
    console.log('selected feature: ' + feautures);
    img.src = '';   
    fDisplay.innerHTML = '';
    mDataDisplay.innerText = '';
    mData.style.display = 'none';

    if (feautures === 'view') {
      convertTypes.style.display = 'inline-block';
    } else {
      convertTypes.style.display = 'none';
    }
    if (feautures === 'create') {
      createBtn.style.display = 'inline-block';
    } else {
      createBtn.style.display = 'none';
    }

    if (feautures === 'delete') {
      deleteBtn.style.display = 'inline-block';
    } else {
      deleteBtn.style.display = 'none';
    }

    if (feautures !== 'create') {
      const fragments = await getUserFragments(user, 1);

      document.getElementById('existingFragmentsLbl').innerText = `Choose a fragment to ${feautures}`;
      removeFragmentsOptions();

      await fillFragmentsOptions(fragments.data.fragments);
    
      current.style.display='inline-block';
      selectSection.style.display='none';

      if (feautures === 'update') {
        importSec.style.display='block';
      } else {
        importSec.style.display='none';
      }
    } else {
      selectSection.style.display='block';
      importSec.style.display='block';
    }
    
  });

  ctype.addEventListener('submit', (e) => handleConvertTypeForm(e));
  async function handleConvertTypeForm(e, id) {
    e.preventDefault();
    fDisplay.innerText = '';
    const selectedConversionType = document.getElementById('convertTypes').value;
    let fragmentId;
    if (feautures === 'view') {
      fragmentId = theFragment.id;
    } else {
      fragmentId = id;
    }
    console.log('selected feature:' + feautures);
    displayFragment(fragmentId, selectedConversionType);
  }

  function handleFile(evt) {
    const files = evt.target.files; 
    const f = files[0];
    const reader = new FileReader();    
    reader.onload = (function() {
      return async function(e) {
        console.log('uploaded file type: ' + f.type);
        if (selectedType && selectedType !== f.type) {
          alert('File type must be same.');
        } else {
          let fragment;

          try {
            if (feautures === 'create') {
              fragment = await postFragment(user, e.target.result, f.type);
            } else {
              fragment = await updateFragment(user, e.target.result, theFragment.id, f.type);
            }
            if (fragment) {
                alert('Fragment has been added/updated');
           }
          } catch (e) {
            alert('There was a error');
          }
        }
      };
    })(f);
    reader.readAsArrayBuffer(f);
  }
}
addEventListener('DOMContentLoaded', init);