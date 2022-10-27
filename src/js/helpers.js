import { async } from 'regenerator-runtime';
import { TIMEOUT_SECS } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    // GET request
    const fetchPromise = fetch(url);
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SECS)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err; // THROW ERR AGAIN so it gets fired by model.js
    // add timeout
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    // POST request
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
      // info about the data
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData)
    });
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SECS)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err; // THROW ERR AGAIN so it gets fired by model.js
    // add timeout
  }
};