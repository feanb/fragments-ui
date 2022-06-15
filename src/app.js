// src/app.js

import { Auth, getUser } from './auth';
import { getUserFragments, getFragmentById, postFragment } from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const fragmentSection = document.querySelector('#fragment');

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };

  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }
  getUserFragments(user);
  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;
  document.getElementById("myForm").onSubmit = () => {
    console.log("input: " + document.getElementById("textFragment").value);
  }
  var myForm = document.querySelector("form");
  myForm.addEventListener("submit", myFunction);   

  //Post functionality is not workinnnnn
  async function myFunction(e) {
    e.preventDefault();
    console.log("User entered: " + document.getElementById("inputFragment").value);
    await postFragment(user, document.getElementById("inputFragment").value);
    const fragment = await getUserFragments(user);
    //use the most recently added fragment's id
    if (fragment && fragment !== undefined) {
      const fg = await getFragmentById(user, fragment.data.fragments[fragment.data.fragments.length -1]);
      fragmentSection.querySelector('.fragment').innerText = fg["data"];
    }
  }
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);